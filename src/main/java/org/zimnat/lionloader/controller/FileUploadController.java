package org.zimnat.lionloader.controller;

import com.poiji.bind.Poiji;
import com.poiji.option.PoijiOptions;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.domain.PremiumDTO;
import org.zimnat.lionloader.business.domain.PremiumItem;
import org.zimnat.lionloader.business.domain.enums.BatchType;
import org.zimnat.lionloader.business.services.BatchService;
import org.zimnat.lionloader.business.services.PremiumService;

import javax.annotation.Resource;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoUnit;
import java.util.*;
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
    DateTimeFormatter dtf= DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    XSSFWorkbook errorWorkbook;
    private static final DecimalFormat df = new DecimalFormat("0.00");
    private static final DecimalFormat df1 = new DecimalFormat("##.00");


    private List<Premium> errorPremiums=new ArrayList<>();

    @Resource
    @Qualifier("USD")
//    @Autowired
    Connection ZWLconnection;

    @Resource
    @Qualifier("ZWL")
//    @Autowired
    Connection USDconnection;

    @Autowired
    BatchService batchService;

    @Autowired
    PremiumService premiumService;


    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getFile(@RequestParam("file") MultipartFile file, @RequestParam("agent") String branchCode, @RequestParam("broker") String broker, @RequestParam(name="currency", required = false) String currency) throws Exception {
        String filename = file.getOriginalFilename();
        String name = filename.substring(0, filename.lastIndexOf(".") + 1);




        if(currency==null){
            currency="USD";
        }

        String dir = "C:/Output/";
        File appFile = new File(dir + filename);
        file.transferTo(appFile);


        workbook = new XSSFWorkbook();
        errorPremiums = addWorksheet(workbook, branchCode, broker,appFile, currency);
        System.err.println("Error Prems::"+errorPremiums.size());
        /*workbook.write(outputStream);
        workbook.close();*/
        appFile.delete();
//        output.delete();

        Batch batch= new Batch();
        batch.setTitle(broker);
        batch.setBatchType(BatchType.FTP_PREMIUM);
        batch=batchService.save(batch);

        for(Premium premium: errorPremiums){
//            System.err.println(premium);
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

    public List<Premium> createPremiumItems(Object [][] data) throws IOException, ParseException {
        List<Premium> premiums= new ArrayList<>();

        System.err.println(" =========================  Processing "+data.length+" premium items ==========================");
        int r=0;
        for(Object[] d: data){

            Premium premium= new Premium();
            if(r>=1) {
                premium = intepretValues(d, r);
                premiums.add(premium);
            }
            r++;
        }
        
        return premiums;
    }

    private List<Premium> addWorksheet(XSSFWorkbook workbook, String branchCode, String agent, File file, String currency) throws SQLException, IOException, ParseException {
        XSSFSheet sheet= workbook.createSheet("Sheet1");
        String[] headers=new String[]{"ROW_NUM","RowID","FIRST_NAME","LAST_NAME","DATE_OF_BIRTH","CLIENT_ADDRESS","CLIENT_PHONE",
                "VEHICLE_MAKE","VEHICLE_MODEL","VEHICLE_REG_NO","VEHICLE_YEAR","COVER_START_DATE","COVER_END_DATE","SUM_INSURED",
                "PAYMENT_METHOD","BRANCH_CODE","ALTERNATIVE_REF", "TITLE", "POLICY_NO","BUSINESS_TYPE","INITIALS",
                "TPBI LIMIT","TPBI PREMIUM", "TPPD LIMIT","TPPD PREMIUM", "ACTUAL_PREMIUM","YEARLY_PREMIUM","CALCULATED RATE","NEW DUTY" };
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
        Object data[][]=getData(file);
        List<Premium> premiumList=createPremiumItems(data);

        List<Premium> errorList=new ArrayList<>();


        int r=0;
        long size=premiumList.size();
        int div=size<21?2:size<201?10:size<1001?50:size<5001?100:size<10001?1000:size<20001?2000:5000;


        for(Premium premium: premiumList){
            if(r>0 && r%div==0){
                System.err.println("------------- "+r+" records processed so far -------------------------");
            }

            premium.setBranchCode(branchCode);
            premium.setAgent(agent);
            premium=getIsErredPremium(premium);
            premium.setAddress(premium.getAddress() + " " + ((premium.getAddress2() == null) ? "" : premium.getAddress2()));


            r++;
                if(!premium.getHasError()
                        //&& !premium.getStatus().equalsIgnoreCase("Cancelled")
                ) {
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
                        String y=premium.getManufactureYear().substring(0, premium.getManufactureYear().lastIndexOf("."));
                        mYearCell.setCellValue(Integer.parseInt(y));
                    } catch (Exception e) {
                        mYearCell.setCellType(CellType.BLANK);
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

                    String policy = getPolicyFTP(premium.getVehicleRegNo(), premium.getLastName(), agent, currency);

                    XSSFCell policyCell = row.createCell(18);
                    policyCell.setCellValue(policy);

                    XSSFCell busTypeCell = row.createCell(19);
                    busTypeCell.setCellValue(premium.getStatus().equalsIgnoreCase("Approved") && !policy.trim().isEmpty() ? "Renewal" : premium.getStatus().equalsIgnoreCase("Cancelled") ? "Cancellation" : "New Policy");

                    XSSFCell initialsCell = row.createCell(20);
                    initialsCell.setCellValue(premium.getFirstName().substring(0, 1) + ((premium.getLastName() != null && !premium.getLastName().isEmpty()) ? premium.getLastName().substring(0, 1) : ""));


                    double rate = 0.0;
                    for (Premium p : premiumList) {
                        if (p.getVehicleType().equalsIgnoreCase("LIGHT MOTOR VEHICLE (1-2300KG)")) {
                            rate = Double.parseDouble(p.getLevy()) / 3.6;
                            continue;
                        }
                    }



                    long days= ChronoUnit.DAYS.between(LocalDate.parse(premium.getCoverStartDate(), dtf), LocalDate.parse(premium.getCoverEndDate(), dtf));
//                    int period=days>183?365:366;
                    double yearly=premium.getRtaAmount()!=null?(366*Double.parseDouble(premium.getRtaAmount())/days):-1;
                    double duty=premium.getRtaAmount()!=null ?0.05*Double.parseDouble(premium.getRtaAmount()):0;
                    double minim=(rate*2)> duty && Double.parseDouble(premium.getDuty())>0?(rate*2):Double.parseDouble(premium.getDuty());
//                    double adjustment= ((minim-duty)*365)/days;
//                    double yrPrem=(premium.getRtaAmount()!=null?((Double.parseDouble(df1.format(365*Double.parseDouble(premium.getRtaAmount())/days)))+adjustment):-1);
//
                    premium.setYearPremium(yearly);


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

                    XSSFCell yearlyCell = row.createCell(26);
                    yearlyCell.setCellValue(premium.getYearPremium());

                    XSSFCell rateCell = row.createCell(27);
                    rateCell.setCellValue(rate);

                    double yrDuty=(100*minim*366)/(112*days);
                    XSSFCell dtyCell = row.createCell(28);
                    dtyCell.setCellValue(yrDuty);

                    /*if(days>300)
                        System.err.println("Name::"+premium.getLastName()+"\t\tDays::"+days+"\t\tRate::"+rate+"\t\tDuty::"+duty+"\t\t YrDuty::"+yrDuty+"\t\tMinim::"+minim+"\t\tRTA::"+premium.getRtaAmount());
*/
                    rowNum++;
                }else{
                    errorList.add(premium);
                }

        }

        return errorList;

    }



    private String getPolicyFTP(String regNumber, String surname, String agent, String currency) throws SQLException {
        String policy="";

        String query="select DISTINCT r.description ,sf.insurance_ref ,sf.agent_shortname , ac.account_name ,pt.resolved_name\n" +
                "from Risk r join Risk_Type rt on r.risk_type_id=rt.risk_type_id join Stats_Detail sd on sd.risk_type_code=rt.code\n" +
                "join Stats_Folder sf on sf.stats_folder_cnt=sd.stats_folder_cnt join Account ac on sf.insurance_holder_shortname=ac.short_code\n" +
                "join Party pt on pt.shortname=ac.short_code join Product p on p.product_id=sf.product_id\n" +
                "where r.description='"+regNumber+"' and ac.account_name='"+surname+"'\n" +
                "and sf.agent_shortname='"+agent+"' and p.code='BMP' order by sf.agent_shortname asc";

        PreparedStatement psmt = currency.equalsIgnoreCase("zwl")?ZWLconnection.prepareStatement(query):USDconnection.prepareStatement(query);

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



            if (premium.getStatus().isEmpty() || premium.getStatus().equalsIgnoreCase("Cancelled")) {
                reason += "status is cancellation,";
            }
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
                premium.setPaymentMethod("Cash");
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
             premium.setHasError(Boolean.TRUE);
             premium.setReason(reason);
             //System.err.println("POSITION::"+position+"\tReason"+premium.getReason());
         }

        return premium;
    }


    public Premium intepretValues(Object[] row, int r) throws IOException, ParseException {
        Premium premium= new Premium();

        //System.err.println("+++++++++++++++++++Data from Data++++++++++++++++"+data.length);

                premium.setAddress(row[11]+" "+row[12]);
                premium.setCoverStartDate(row[23]!=null?row[23].toString():"");
                premium.setCoverEndDate(row[24]!=null?row[24].toString():"");
                premium.setPaymentMethod(row[32]!=null?row[32].toString():"");
                premium.setRow(r+1);
                premium.setManufactureYear(row[20]!=null?row[20].toString():"");
                premium.setVehicleRegNo(row[25]!=null?row[25].toString():"");
                premium.setMake(row[17]!=null?row[17].toString():"");
                premium.setModel(row[18]!=null?row[18].toString():"");
                premium.setFullName(row[9]!=null?row[9].toString():"");
                premium.setLevy(row[29]!=null?row[29].toString():"");
                premium.setDuty(row[28]!=null?row[28].toString():"");
                premium.setDob(row[14]!=null?row[14].toString():"");
                premium.setStatus(row[4]!=null?row[4].toString():"");
                premium.setVehicleType(row[19]!=null?row[19].toString():"");
        DateTimeFormatter dtf= DateTimeFormatter.ofPattern("dd-MMM-yyyy");

        long days= ChronoUnit.DAYS.between(LocalDate.parse(premium.getCoverStartDate(), dtf), LocalDate.parse(premium.getCoverEndDate(), dtf));
        df1.setRoundingMode(RoundingMode.HALF_UP);
        double period=Double.parseDouble(df1.format((days/90)));

                premium.setPeriods(period);
                premium.setAlternativeRef(row[21]!=null?row[21].toString():"");
                try{
                    premium.setRowId(new BigDecimal(row[0].toString()).longValue());
                }catch(Exception e){}

                try {
                    premium.setRtaAmount((row[30]!=null)?(df.format(Double.parseDouble(row[30].toString()))):"");
                    premium.setSumInsured((row[27]!=null)?Double.parseDouble(row[27].toString()):0);
                    premium.setPremium((row[31]!=null)?Double.parseDouble(row[31].toString()):0);
                    premium.setPhone((row[10]!=null)?new BigDecimal(row[10].toString()).longValue():0);

                }catch(Exception e){}

        //System.err.println("SURNAME::"+premium.getLastName()+"START::"+premium.getCoverStartDate()+"\t\t END::"+premium.getCoverEndDate()+"\t\tDAYS:: "+days+"\t\tPERIODS::"+period+"\t\t Yearly:: "+ premium.getYearPremium()+"\t\t RTA::"+premium.getRtaAmount());



        return premium;
    }

    public static String[][] getData(File file) {
        String[][] dataTable = null;

        try {
            // Create a file input stream to read Excel workbook and worksheet
            FileInputStream xlfile = new FileInputStream(file);
            HSSFWorkbook xlwb = new HSSFWorkbook(xlfile);
            HSSFSheet xlSheet = xlwb.getSheetAt(0);

            // Get the number of rows and columns
            int numRows = xlSheet.getLastRowNum() + 1;
            int numCols = xlSheet.getRow(0).getLastCellNum();

            // Create double array data table - rows x cols
            // We will return this data table
            dataTable = new String[numRows][numCols];

            // For each row, create a HSSFRow, then iterate through the "columns"
            // For each "column" create an HSSFCell to grab the value at the specified cell (i,j)
            for (int i = 0; i < numRows; i++) {
                HSSFRow xlRow = xlSheet.getRow(i);
//                if(xlRow.getCell(0)!=null && xlRow.getCell(3)!=null && xlRow.getCell(9)!=null){
                    for (int j = 0; j < numCols; j++) {
                        HSSFCell xlCell = xlRow.getCell(j);
                        dataTable[i][j] = (xlCell!=null)?xlCell.toString():"";
                    }
               /* }else{
                    i--;
                }*/

            }
        } catch (IOException e) {
            System.out.println("ERROR FILE HANDLING " + e.toString());
        }
        /*for(String[] d:dataTable){
            for(String s:d){
                System.err.print(s +"\t");
            }
            System.err.print("\n");
        }*/
        return dataTable;
    }

    public  Object[][] getvalues(File file) throws IOException, InvalidFormatException {
        Workbook workbook= new XSSFWorkbook(file);
        Row row;
        HSSFCell cell;
        Object[][] values = null;

        try {

            //get sheet number
            Sheet sheet = workbook.getSheetAt(0);
            int cells = sheet.getRow(0).getPhysicalNumberOfCells();
            int rows = sheet.getPhysicalNumberOfRows();
            int cols=37;

            System.err.println("Rows::"+rows+" && Cols::"+cols);
            values = new String[rows][cells];


            for (int r = 0; r < rows; r++) {
                row = sheet.getRow(r); // bring row
                if (row != null) {
                    for (int c = 0; c < cols; c++) {
                        cell = (HSSFCell) row.getCell(c);
                        if (cell != null) {
                            values[r][c] = cell.getStringCellValue();
                            System.err.println(values[r][c]);
                        }
                    }
                    System.err.println("");
                }
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return values;
    }

}
