package org.zimnat.lionloader.business.domain;

import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;
import excel.annotation.ExcelCell;
import excel.annotation.ExcelSheet;
import excel.model.ExcelCellType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/11/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */
@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
@ExcelSheet(name = "Sheet1")
public class Premium {


    @ExcelRow
    @ExcelCell(header = "ROW_NUM", type = ExcelCellType.INTEGER)
    private long row;

    @ExcelCellName("Customer_Name")
    private String fullName;

    private String firstName;

    private String lastName;

    @ExcelCellName("ID")
    private long rowId;

    @ExcelCellName("Birth_Date")
    private String dob;

    @ExcelCellName("Customer_Phone")
    private long phone;

    @ExcelCellName("Customer_Add1")
    private String address;

    @ExcelCellName("Customer_Add2")
    private String address2;

    @ExcelCellName("Status")
    private String status;

    @ExcelCellName("Make")
    private String make;

    @ExcelCellName("Model")
    private String model;

    @ExcelCellName("VRN")
    private String vehicleRegNo;

    @ExcelCellName("Year_Manufacture")
    private String manufactureYear;

    @ExcelCellName("Start_Date")
    private String coverStartDate;

    @ExcelCellName("End_Date")
    private String coverEndDate;

    @ExcelCellName("Policy_Cover")
    private double sumInsured;

    @ExcelCellName("Stamp_Duty")
    private String duty;

    @ExcelCellName("Government_Levy")
    private String levy;

    @ExcelCellName("RTA_Amount")
    private String rtaAmount;

    @ExcelCellName("Premium_Collected")
    private double premium;

    @ExcelCellName("Vehicle_Type")
    @ExcelCell(header = "VEHICLE_TYPE")
    private String vehicleType;

    @ExcelCellName("Payment Method")
    @ExcelCell(header = "PAY_METHOD")
    private String paymentMethod;

    @ExcelCellName("Location")
    @ExcelCell(header = "BRANCH_CODE")
    private String branchCode;

    @ExcelCell(header = "AGENT_CODE")
    private String Agent;

    @ExcelCell(header = "FAILURE_REASON")
    private String reason;


    @ExcelCellName("Policy_No")
    @ExcelCell(header = "ALTERNATIVE_REF")
    private String alternativeRef;

    private double periods;
    private Double minim;
    private double yearPremium;
    private Boolean hasError=Boolean.FALSE;



}
