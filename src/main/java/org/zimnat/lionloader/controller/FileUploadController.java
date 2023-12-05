package org.zimnat.lionloader.controller;

import com.poiji.bind.Poiji;
import com.poiji.option.PoijiOptions;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.domain.PremiumItem;
import org.zimnat.lionloader.business.domain.Response;
import org.zimnat.lionloader.business.domain.enums.BatchType;
import org.zimnat.lionloader.business.services.BatchService;
import org.zimnat.lionloader.business.services.PremiumService;
import org.zimnat.lionloader.business.services.UserService;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.http.HttpResponse;
import java.sql.*;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @author :: codemaster
 * created on :: 11/5/2023
 */

@RestController
@RequestMapping("api/upload")
public class FileUploadController {

    XSSFWorkbook workbook;
    SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yy");
    SimpleDateFormat sdf1 = new SimpleDateFormat("dd/MM/yyyy");
    SimpleDateFormat sdfOut = new SimpleDateFormat("MMM-dd-yy");

    XSSFWorkbook errorWorkbook;
    private static final DecimalFormat df = new DecimalFormat("0.00");

    private List<Premium> errorPremiums=new ArrayList<>();

    @Autowired
    Connection connection;

    @Autowired
    BatchService batchService;

    @Autowired
    PremiumService premiumService;

    @Resource
    private UserService userService;



    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getFile(@RequestParam("file") MultipartFile file, @RequestParam("agent") String branchCode, @RequestParam("broker") String broker) throws Exception {
        String filename = file.getOriginalFilename();
        String name = filename.substring(0, filename.lastIndexOf(".") + 1);


        String dir = "C:/Output/";
        File appFile = new File(dir + filename);
        file.transferTo(appFile);
        PoijiOptions poijiOptions = PoijiOptions.PoijiOptionsBuilder.settings(1)
                .caseInsensitive(true)
                .sheetIndex(0)
                .preferNullOverDefault(true)
                .trimCellValue(true)
                .build();

        List<Premium> premiums = Poiji.fromExcel(appFile, Premium.class, poijiOptions);

        System.err.println("File received --- "+filename+" --- Number of Records --- "+premiums.size()+" ---");
//        ExcelWriter.write(dirname, "MyFile.xlsx", premiums);
//        File output = new File(name + "_formatted.xlsx");
//        FileOutputStream outputStream = new FileOutputStream(output);

        workbook = new XSSFWorkbook();
        errorPremiums = addWorksheet(workbook, premiums, branchCode, broker);
        /*workbook.write(outputStream);
        workbook.close();*/
        appFile.delete();
//        output.delete();

        Batch batch= new Batch();
        batch.setTitle(broker);
        batch.setBatchType(BatchType.FTP_PREMIUM);
        batch=batchService.save(batch);

        for(Premium premium: errorPremiums){
            PremiumItem premiumItem=new PremiumItem();
            premiumItem=premiumItem.createPremiumItem(premium);
            premiumItem.setBatch(batch);
            premiumService.save(premiumItem);
        }

        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        workbook.write(stream);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        headers.setContentDispositionFormData("attachment", name + "_formatted.xlsx");
        System.err.println("*************************** Done preparing excel file, Now downloading *************************");
        return ResponseEntity.ok()
                .headers(headers)
                .body(stream.toByteArray());


    }

    @GetMapping("/")
    public ResponseEntity<?> downloadFile(@RequestParam String fileName) throws IOException {

        File file = new File(fileName);
        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=" + file.getName())
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .contentLength(file.length())
                .body(resource);
    }


    private List<Premium> addWorksheet(XSSFWorkbook workbook, List<Premium> premiumList, String branchCode, String agent) throws SQLException, IOException {
        XSSFSheet sheet= workbook.createSheet("Sheet1");
        String[] headers=new String[]{"ROW_NUM","RowID","FIRST_NAME","LAST_NAME","DATE_OF_BIRTH","CLIENT_ADDRESS","CLIENT_PHONE",
                "VEHICLE_MAKE","VEHICLE_MODEL","VEHICLE_REG_NO","VEHICLE_YEAR","COVER_START_DATE","COVER_END_DATE","SUM_INSURED",
                "PAYMENT_METHOD","BRANCH_CODE","ALTERNATIVE_REF", "TITLE", "POLICY_NO","BUSINESS_TYPE","INITIALS",
                "TPBI LIMIT","TPBI PREMIUM", "TPPD LIMIT","TPPD PREMIUM", "ACTUAL_PREMIUM" };
        CreationHelper creationHelper= workbook.getCreationHelper();
        CellStyle dateCellStyle = workbook.createCellStyle();
        short format = creationHelper.createDataFormat().getFormat("dd/MM/yyyy");

        dateCellStyle.setDataFormat(format);
        int rowNum=1;

        //create header row
        XSSFRow headerRow = sheet.createRow(0);
        int col=0;
        for(String title: headers){
            XSSFCell rowCell = headerRow.createCell(col);
            rowCell.setCellValue(title);
            col++;
        }

        //add data to the worksheet

        List<Premium> errorList=new ArrayList<>();

        int r=0;
        long size=premiumList.size();
        int div=size<21?2:size<201?10:size<1001?50:size<5001?100:size<10001?1000:size<20001?2000:5000;
        for(Premium premium: premiumList){
            if(r>0 && r%div==0){
                System.err.println("------------- "+r+" records processed so far -------------------------");
            }
            if(premium!=null && (premium.getFullName()==null || premium.getFullName().trim().length()<=0)){
                String data[][]=read(workbook,headers.length);
                String row[]=data[r];
                System.err.println("+++++++++++++++++++Data from Data++++++++++++++++");
                System.err.println(data[r]);
            }
            premium.setBranchCode(branchCode);
            premium.setAgent(agent);
            premium=getIsErredPremium(premium);
            premium.setAddress(premium.getAddress() + " " + ((premium.getAddress2() == null) ? "" : premium.getAddress2()));


            r++;
                if(!premium.getHasError()) {
                    XSSFRow row = sheet.createRow(rowNum);
                    XSSFCell rowCell = row.createCell(0);
                    rowCell.setCellValue(premium.getRow());

                    XSSFCell rowIdCell = row.createCell(1);
                    rowIdCell.setCellValue(premium.getRowId());

                    XSSFCell fistNameCell = row.createCell(2);
                    fistNameCell.setCellValue(premium.getFirstName().trim());

                    XSSFCell lastNameCell = row.createCell(3);
                    lastNameCell.setCellValue(premium.getLastName().trim());


                    XSSFCell dobCell = row.createCell(4);
                    try {
                        Date start = sdf1.parse(premium.getDob());
                        String st = sdfOut.format(start);

                        dobCell.setCellValue(sdfOut.parse(st));
                        dobCell.setCellStyle(dateCellStyle);
                    } catch (Exception e) {
                        dobCell.setCellType(CellType.BLANK);
                    }


                    XSSFCell addressCell = row.createCell(5);
                    addressCell.setCellValue(premium.getAddress());

                    XSSFCell phoneCell = row.createCell(6);
                    phoneCell.setCellValue(premium.getPhone());
                    phoneCell.setCellType(CellType.NUMERIC);
                    CellStyle style = workbook.createCellStyle();
                    style.setDataFormat((short) 0x1);
                    phoneCell.setCellStyle(style);

                    XSSFCell makeCell = row.createCell(7);
                    makeCell.setCellValue(premium.getMake());

                    XSSFCell modelCell = row.createCell(8);
                    modelCell.setCellValue(premium.getModel());

                    XSSFCell regCell = row.createCell(9);
                    regCell.setCellValue(premium.getVehicleRegNo());

                    XSSFCell mYearCell = row.createCell(10);
                    try {
                        mYearCell.setCellValue(Integer.parseInt(premium.getManufactureYear()));
                    } catch (Exception e) {
                        mYearCell.setCellValue(premium.getManufactureYear());
                    }

                    XSSFCell startCell = row.createCell(11);
                    try {
                        Date start = sdf.parse(premium.getCoverStartDate());
                        String st = sdfOut.format(start);

                        startCell.setCellValue(sdfOut.parse(st));
                        startCell.setCellStyle(dateCellStyle);
                    } catch (Exception e) {
                        startCell.setCellType(CellType.BLANK);
                    }


                    XSSFCell endCell = row.createCell(12);
                    try {
                        Date end = sdf.parse(premium.getCoverEndDate());
                        endCell.setCellValue(end);
                        endCell.setCellStyle(dateCellStyle);
                    } catch (Exception e) {
                        endCell.setCellType(CellType.BLANK);
                    }

                    XSSFCell sumCell = row.createCell(13);
                    sumCell.setCellValue(premium.getSumInsured());

                    XSSFCell pMethodCell = row.createCell(14);
                    pMethodCell.setCellValue(premium.getPaymentMethod().equalsIgnoreCase("ecocash") || premium.getPaymentMethod().equalsIgnoreCase("12") || premium.getPaymentMethod().equalsIgnoreCase("PDS") ? "Mobile Money" : premium.getPaymentMethod());

                    XSSFCell branchCell = row.createCell(15);
                    branchCell.setCellValue(branchCode);

                    XSSFCell refCell = row.createCell(16);
                    refCell.setCellValue(premium.getAlternativeRef());

                    XSSFCell titleCell = row.createCell(17);
                    titleCell.setCellValue("Prof");

                    String policy = getPolicyFTP(premium.getVehicleRegNo(), premium.getLastName(), agent);

                    XSSFCell policyCell = row.createCell(18);
                    policyCell.setCellValue(policy);

                    XSSFCell busTypeCell = row.createCell(19);
                    busTypeCell.setCellValue(premium.getStatus().equalsIgnoreCase("Approved") && !policy.trim().isEmpty() ? "Renewal" : premium.getStatus().equalsIgnoreCase("Cancelled") ? "Cancellation" : "New Policy");

                    XSSFCell initialsCell = row.createCell(20);
                    initialsCell.setCellValue(premium.getFirstName().substring(0, 1) + ((premium.getLastName() != null && !premium.getLastName().isEmpty()) ? premium.getLastName().substring(0, 1) : ""));


                    double rate = 0.0;
                    for (Premium p : premiumList) {
                        if (p.getVehicleType().equalsIgnoreCase("LIGHT MOTOR VEHICLE (1-2300KG)")) {
//                        System.err.println("Found a light motor vehicle\n"+p);
                            rate = Double.parseDouble(p.getLevy()) / 3.6;
                            continue;
                        }
                    }

                    double limit = 2000;
                    XSSFCell tpbiLimitCell = row.createCell(21);
                    tpbiLimitCell.setCellValue(Double.parseDouble(df.format(limit * rate)));

                    double prem = Double.parseDouble(df.format(Double.parseDouble(premium.getRtaAmount()) / 2));
                    XSSFCell tpbiPremiumCell = row.createCell(22);
                    tpbiPremiumCell.setCellValue(prem);

                    XSSFCell tppdLimitCell = row.createCell(23);
                    tppdLimitCell.setCellValue(Double.parseDouble(df.format(limit * rate)));

                    XSSFCell tppdPremiumCell = row.createCell(24);
                    tppdPremiumCell.setCellValue(prem);

                    XSSFCell premCell = row.createCell(25);
                    premCell.setCellValue(premium.getPremium());


                    rowNum++;
                }else{
                    errorList.add(premium);
                }

        }

        return errorList;

    }



    private String getPolicyFTP(String regNumber, String surname, String agent) throws SQLException {
        String policy="";

        String query="select DISTINCT r.description ,sf.insurance_ref ,sf.agent_shortname , ac.account_name ,pt.resolved_name\n" +
                "from Risk r join Risk_Type rt on r.risk_type_id=rt.risk_type_id join Stats_Detail sd on sd.risk_type_code=rt.code\n" +
                "join Stats_Folder sf on sf.stats_folder_cnt=sd.stats_folder_cnt join Account ac on sf.insurance_holder_shortname=ac.short_code\n" +
                "join Party pt on pt.shortname=ac.short_code join Product p on p.product_id=sf.product_id\n" +
                "where r.description='"+regNumber+"' and ac.account_name='"+surname+"'\n" +
                "and sf.agent_shortname='"+agent+"' and p.code='FTPBULK' order by sf.agent_shortname asc";

        PreparedStatement psmt = connection.prepareStatement(query);

        psmt.execute();
        // Retrieve the generated key from the insert.
        ResultSet resultSet = psmt.executeQuery();

        // Print the ID of the inserted row.
        while (resultSet.next()) {
            policy=resultSet.getString("insurance_ref");
        }

        return policy;
    }

    public Premium getIsErredPremium(Premium premium){

        String reason = "";
        try {
            int idx = premium.getFullName().lastIndexOf(' ');
            String firstName = premium.getFullName().substring(0, idx);
            String lastName = premium.getFullName().substring(idx + 1);

            premium.setFirstName(firstName);
            premium.setLastName(lastName);



            if (firstName.isEmpty()) {
                reason += "fname-empty,";
            }
            if (lastName.isEmpty()) {
                reason += "lname-empty,";
            }
            if (premium.getCoverEndDate().isEmpty()) {
                reason += "sDate-empty,";
            }
            if (premium.getCoverStartDate().isEmpty()) {
                reason += "eDate-empty,";
            }
            if (premium.getVehicleRegNo().isEmpty()) {
                reason += "regNo-empty,";
            }
            if (premium.getAddress().isEmpty()) {
                reason += "addr-empty,";
            }
            if (premium.getDuty().isEmpty()) {
                reason += "duty-empty,";
            }
            if (premium.getLevy().isEmpty()) {
                reason += "duty-empty,";
            }
            if (premium.getMake().isEmpty()) {
                reason += "make-empty,";
            }
            if (premium.getPaymentMethod().isEmpty()) {
                reason += "payType-empty,";
            }
            if (premium.getMake().contains(" ")) {
                reason += "make-space,";
            }
            if (premium.getModel().isEmpty()) {
                reason += "model-empty,";
            }
            if (premium.getRtaAmount().isEmpty()) {
                reason += "rta-empty,";
            }
            if (premium.getVehicleType().isEmpty()) {
                reason += "vType-empty,";
            }
        }catch(Exception e){
            reason+=e.getMessage()+",";
        }

         reason=(!reason.isEmpty())? Arrays.stream(reason.split(",")).collect(Collectors.joining(",")) : "";
         if(!reason.isEmpty() && reason.trim().length()>0){
             System.err.println(reason);
             System.err.println(premium);
             System.err.println("===============================================");
             premium.setHasError(Boolean.TRUE);
             premium.setReason(reason);
         }

        return premium;
    }


    public String[][] read(XSSFWorkbook w, int cols) throws IOException
    {
        String[][] data = null;

        try
        {
            XSSFSheet sheet = w.getSheet("Sheet1");
            data = new String[cols][sheet.getLastRowNum()];
            // Loop over first 10 column and lines
            //     System.out.println(sheet.getColumns() +  " " +sheet.getRows());
            for (int j = 0; j <cols; j++)
            {
                for (int i = 0; i < sheet.getLastRowNum(); i++)
                {
                    XSSFCell cell = sheet.getRow( i).getCell(j);
                    data[j][i] = cell.getRawValue();
                    //  System.out.println(cell.getContents());
                }
            }

        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return data;
    }

}
