package org.zimnat.lionloader.controller;

import com.poiji.bind.Poiji;
import com.poiji.option.PoijiOptions;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.domain.Response;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.http.HttpResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * @author :: codemaster
 * created on :: 11/5/2023
 */

@RestController
@RequestMapping("api/upload")
public class FileUploadController {

    XSSFWorkbook workbook;
    SimpleDateFormat sdf = new SimpleDateFormat("dd-MMM-yy");
    SimpleDateFormat sdfOut = new SimpleDateFormat("d/MM/yyyy");



    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE,produces = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getFile(@RequestParam("file") MultipartFile file, @RequestParam("agent") String branchCode) throws Exception {
        String filename=file.getOriginalFilename();
        String name=filename.substring(0,filename.lastIndexOf(".")+1);

       /* File dir = new File(folder);
        if(!dir.exists()){
            try{
                dir.mkdirs();
            }catch(Exception e){
                System.err.println("ERROR::"+e.getMessage());
                File d = new File("C:/Output/");
                if(!d.exists()){
                    d.mkdirs();
                    dir=d;
                }
            }


        }
        String dirname=dir.getAbsolutePath()+"\\";*/

        String dir="C:/Output/";
        File appFile=new File(dir+filename);
        file.transferTo(appFile);
        PoijiOptions poijiOptions= PoijiOptions.PoijiOptionsBuilder.settings(1)
                .caseInsensitive(true)
                .sheetIndex(0)
                .preferNullOverDefault(true)
                .trimCellValue(true)
                .build();

        List<Premium> premiums= Poiji.fromExcel(appFile, Premium.class, poijiOptions);

//        ExcelWriter.write(dirname, "MyFile.xlsx", premiums);
        File output=new File(name+"_formatted.xlsx");
        FileOutputStream outputStream = new FileOutputStream(output);
        workbook= new XSSFWorkbook();
        addWorksheet(workbook, premiums, branchCode);
        /*workbook.write(outputStream);
        workbook.close();*/
        appFile.delete();
        output.delete();

        ByteArrayOutputStream stream= new ByteArrayOutputStream();
        workbook.write(stream);
        HttpHeaders headers= new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/vnd.ms-excel"));
        headers.setContentDispositionFormData("attachment",name+"_formatted.xlsx");
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


    private void addWorksheet(XSSFWorkbook workbook, List<Premium> premiumList, String branchCode){
        XSSFSheet sheet= workbook.createSheet("Sheet1");
        String[] headers=new String[]{"ROW_NUM","RowID","FIRST_NAME","LAST_NAME","DATE_OF_BIRTH","CLIENT_ADDRESS","CLIENT_PHONE",
                "VEHICLE_MAKE","VEHICLE_MODEL","VEHICLE_REG_NO","VEHICLE_YEAR","COVER_START_DATE","COVER_END_DATE","SUM_INSURED",
                "PREMIUM","PAYMENT_METHOD","BRANCH_CODE","ALTERNATIVE_REF", "TITLE", "POLICY_NO","BUSINESS_TYPE","INITIALS" };
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
        for(Premium premium: premiumList){
            int idx = premium.getFullName().lastIndexOf(' ');
            if (idx >=0) {

                String firstName = premium.getFullName().substring(0, idx);
                String lastName  = premium.getFullName().substring(idx + 1);

                XSSFRow row = sheet.createRow(rowNum);
                XSSFCell rowCell = row.createCell(0);
                rowCell.setCellValue(premium.getRow());

                XSSFCell rowIdCell = row.createCell(1);
                rowIdCell.setCellValue(premium.getRowId());

                XSSFCell fistNameCell = row.createCell(2);
                fistNameCell.setCellValue(firstName);

                XSSFCell lastNameCell = row.createCell(3);
                lastNameCell.setCellValue(lastName);

                XSSFCell dobCell = row.createCell(4);
                dobCell.setCellValue(premium.getDob());
                /*try{
                    //Date dob=Date.from(Instant.parse(premium.getDob()));
                    dobCell.setCellValue(premium.getDob());
                    dobCell.setCellStyle(dateCellStyle);
                }catch(Exception e){
                    dobCell.setCellValue("");
                }*/


                XSSFCell addressCell = row.createCell(5);
                addressCell.setCellValue(premium.getAddress()+" "+((premium.getAddress2()==null)?"":premium.getAddress2()));

                XSSFCell phoneCell = row.createCell(6);
                phoneCell.setCellValue(premium.getPhone());
                phoneCell.setCellType(CellType.NUMERIC);
                CellStyle style = workbook.createCellStyle();
                style.setDataFormat((short)0x1);
                phoneCell.setCellStyle(style);

                XSSFCell makeCell = row.createCell(7);
                makeCell.setCellValue(premium.getMake());

                XSSFCell modelCell = row.createCell(8);
                modelCell.setCellValue(premium.getModel());

                XSSFCell regCell = row.createCell(9);
                regCell.setCellValue(premium.getVehicleRegNo());

                XSSFCell mYearCell = row.createCell(10);
                try{
                    mYearCell.setCellValue(Integer.parseInt(premium.getManufactureYear()));
                }catch(Exception e){
                    mYearCell.setCellValue(premium.getManufactureYear());
                }

                XSSFCell startCell = row.createCell(11);
                try{
                    Date start=sdf.parse(premium.getCoverStartDate());
                    startCell.setCellValue(start);
                    startCell.setCellStyle(dateCellStyle);
                }catch(Exception e){
                    startCell.setCellType(CellType.BLANK);
                }


                XSSFCell endCell = row.createCell(12);
                try{
                    Date end=sdf.parse(premium.getCoverEndDate());
                    endCell.setCellValue(end);
                    endCell.setCellStyle(dateCellStyle);
                }catch(Exception e){
                    endCell.setCellType(CellType.BLANK);
                }

                XSSFCell sumCell = row.createCell(13);
                sumCell.setCellValue(premium.getSumInsured());

                XSSFCell premiumCell = row.createCell(14);
                premiumCell.setCellValue(premium.getPremium());

                XSSFCell pMethodCell = row.createCell(15);
                pMethodCell.setCellValue(premium.getPaymentMethod().equalsIgnoreCase("ecocash") || premium.getPaymentMethod().equalsIgnoreCase("12") || premium.getPaymentMethod().equalsIgnoreCase("PDS")?"Mobile Money":premium.getPaymentMethod());

                XSSFCell branchCell = row.createCell(16);
                branchCell.setCellValue(branchCode);

                XSSFCell refCell = row.createCell(17);
                refCell.setCellValue(premium.getAlternativeRef());

                XSSFCell titleCell = row.createCell(18);
                titleCell.setCellValue("Prof");

                XSSFCell policyCell = row.createCell(19);
                policyCell.setCellValue("");

                XSSFCell busTypeCell = row.createCell(20);
                busTypeCell.setCellValue(premium.getStatus().equalsIgnoreCase("Approved")?"New Policy":premium.getStatus().equalsIgnoreCase("Cancelled")?"Cancellation":"Renewal");

                XSSFCell initialsCell = row.createCell(21);
                initialsCell.setCellValue(firstName.substring(0,1)+((lastName!=null && !lastName.isEmpty())?lastName.substring(0,1):""));

                rowNum++;
            }
        }

    }

}
