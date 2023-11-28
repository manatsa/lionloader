package org.zimnat.lionloader.business.domain;

import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/11/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//@ExcelSheet("Sheet1")
//@ExcelSheet(name = "Sheet1")
public class Premium {

    @ExcelRow
//    @ExcelCell(header = "ROW_NUM", type = ExcelCellType.INTEGER)
    private long row;

    @ExcelCellName("Customer_Name")
//    @ExcelCell(header = "FULLNAME")
    private String fullName;

    @ExcelCellName("ID")
//    @ExcelCell(header = "RowID", type = ExcelCellType.INTEGER)
    private long rowId;

    @ExcelCellName("Birth_Date")
//    @ExcelCell(header = "DATE_OF_BIRTH", type = ExcelCellType.DATE)
    private String dob;

    @ExcelCellName("Customer_Phone")
//    @ExcelCell(header = "MOBILE_PHONE")
    private long phone;

    @ExcelCellName("Customer_Add1")
//    @ExcelCell(header = "CUSTOMER_ADDRESS")
    private String address;

    @ExcelCellName("Customer_Add2")
    private String address2;

    @ExcelCellName("Status")
//    @ExcelCell(header = "STATUS")
    private String status;

    @ExcelCellName("Make")
//    @ExcelCell(header = "MAKE")
    private String make;

    @ExcelCellName("Model")
//    @ExcelCell(header = "MODEL")
    private String model;

    @ExcelCellName("VRN")
//    @ExcelCell(header = "VEHICLE_REG_NO")
    private String vehicleRegNo;

    @ExcelCellName("Year_Manufacture")
//    @ExcelCell(header = "MANUFACTURE_YEAR", type = ExcelCellType.INTEGER)
    private String manufactureYear;

    @ExcelCellName("Start_Date")
//    @ExcelCell(header = "START_DATE", type = ExcelCellType.DATE)
    private String coverStartDate;

    @ExcelCellName("End_Date")
//    @ExcelCell(header = "END_DATE", type = ExcelCellType.DATE)
    private String coverEndDate;

    @ExcelCellName("Policy_Cover")
//    @ExcelCell(header = "SUM_INSURED", type = ExcelCellType.INTEGER)
    private double sumInsured;

    @ExcelCellName("Stamp_Duty")
//    @ExcelCell(header = "STAMP_DUTY", type = ExcelCellType.DECIMAL)
    private String duty;

    @ExcelCellName("Government_Levy")
//    @ExcelCell(header = "LEVY", type = ExcelCellType.DECIMAL)
    private String levy;

    @ExcelCellName("RTA_Amount")
//    @ExcelCell(header = "RTA_AMOUNT", type = ExcelCellType.DECIMAL)
    private String rta;

    @ExcelCellName("Premium_Collected")
//    @ExcelCell(header = "PREMIUM", type = ExcelCellType.DECIMAL)
    private double premium;

    @ExcelCellName("Payment Method")
//    @ExcelCell(header = "PAY_METHOD")
    private String paymentMethod;

    @ExcelCellName("Location")
//    @ExcelCell(header = "BRANCH_CODE")
    private String branchCode;

    @ExcelCellName("Policy_No")
//    @ExcelCell(header = "ALTERNATIVE_REF")
    private String alternativeRef;



}
