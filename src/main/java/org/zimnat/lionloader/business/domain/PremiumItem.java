package org.zimnat.lionloader.business.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.poiji.annotation.ExcelCellName;
import com.poiji.annotation.ExcelRow;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.poi.excel.annotation.ExcelCell;
import org.apache.poi.excel.annotation.ExcelSheet;
import org.apache.poi.excel.model.ExcelCellType;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Date;

/**
 * @author :: codemaster
 * created on :: 9/11/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
//@ExcelSheet("Sheet1")
//@ExcelSheet(name = "Sheet1")
public class Premium {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ExcelRow
    @ExcelCell(header = "ROW_NUM", type = ExcelCellType.INTEGER)
    private long premiumRow;

    @ExcelCellName("Customer_Name")
    @ExcelCell(header = "FULLNAME")
    private String fullName;

    @ExcelCell(header = "FIRSTNAME")
    private String firstName;

    @ExcelCell(header = "LASTNAME")
    private String lastName;

    @ExcelCellName("ID")
    @ExcelCell(header = "RowID", type = ExcelCellType.INTEGER)
    private long rowId;

    @ExcelCell(header = "RowNumber", type = ExcelCellType.INTEGER)
    private long rowNum;

    @ExcelCellName("Birth_Date")
    @ExcelCell(header = "DATE_OF_BIRTH", type = ExcelCellType.DATE)
    private String dob;

    @ExcelCellName("Customer_Phone")
    @ExcelCell(header = "MOBILE_PHONE")
    private long phone;

    @ExcelCellName("Customer_Add1")
    @ExcelCell(header = "CUSTOMER_ADDRESS")
    private String customerAddress;

    @ExcelCellName("Customer_Add2")
    private String address2;

    @ExcelCellName("Status")
    @ExcelCell(header = "STATUS")
    private String premiumStatus;

    @ExcelCellName("Make")
    @ExcelCell(header = "MAKE")
    private String vehicleMake;

    @ExcelCellName("Model")
    @ExcelCell(header = "MODEL")
    private String vehicleModel;

    @ExcelCellName("VRN")
    @ExcelCell(header = "VEHICLE_REG_NO")
    private String vehicleRegNo;

    @ExcelCellName("Year_Manufacture")
    @ExcelCell(header = "MANUFACTURE_YEAR", type = ExcelCellType.INTEGER)
    private String manufactureYear;

    @ExcelCellName("Start_Date")
    @ExcelCell(header = "START_DATE", type = ExcelCellType.DATE)
    private String coverStartDate;

    @ExcelCellName("End_Date")
    @ExcelCell(header = "END_DATE", type = ExcelCellType.DATE)
    private String coverEndDate;

    @ExcelCellName("Policy_Cover")
    @ExcelCell(header = "SUM_INSURED", type = ExcelCellType.INTEGER)
    private double sumInsured;

    @ExcelCellName("Stamp_Duty")
    @ExcelCell(header = "STAMP_DUTY", type = ExcelCellType.DECIMAL)
    private String duty;

    @ExcelCellName("Government_Levy")
    @ExcelCell(header = "LEVY", type = ExcelCellType.DECIMAL)
    private String levy;

    @ExcelCellName("RTA_Amount")
    @ExcelCell(header = "RTA_AMOUNT", type = ExcelCellType.DECIMAL)
    private String rtaAmount;

    @ExcelCellName("Premium_Collected")
    @ExcelCell(header = "PREMIUM", type = ExcelCellType.DECIMAL)
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
    private String agent;

    @ExcelCell(header = "FAILURE_REASON")
    private String failureReason;


    @ExcelCellName("Policy_No")
    @ExcelCell(header = "ALTERNATIVE_REF")
    private String alternativeRef;

    private Boolean hasError=Boolean.FALSE;

    @ManyToOne(optional = false)
    @JoinColumn(name = "batch_id", nullable = false)
    private Batch batch;


}
