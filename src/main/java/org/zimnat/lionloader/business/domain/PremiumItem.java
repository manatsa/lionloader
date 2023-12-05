package org.zimnat.lionloader.business.domain;

import com.poiji.annotation.ExcelRow;
import excel.annotation.ExcelCell;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


/**
 * @author :: codemaster
 * created on :: 9/11/2023
 * Package Name :: org.zimnat.lionloader.business.domain
 */
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
//@ExcelSheet(name = "Sheet1")
public class PremiumItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ExcelRow
    private long premiumRow;

    @ExcelCell(header="Customer_Name")
    private String fullName;

    @ExcelCell(header="RowId")
    private long rowId;

    @ExcelCell(header = "Birth_Date")
    private String dob;

    @ExcelCell(header = "Customer_Phone")
    private long phone;

    @ExcelCell(header = "Customer_Add1")
    private String customerAddress;

    @ExcelCell(header = "Status")
    private String premiumStatus;

    @ExcelCell(header = "Make")
    private String vehicleMake;

    @ExcelCell(header = "Model")
    private String vehicleModel;

    @ExcelCell(header = "VehicleRegNo")
    private String vehicleRegNo;

    @ExcelCell(header = "Year_Manufacture")
    private String manufactureYear;

    @ExcelCell(header = "Start_Date")
    private String coverStartDate;

    @ExcelCell(header = "End_Date")
    private String coverEndDate;

    @ExcelCell(header = "Policy_Cover")
    private double sumInsured;

    @ExcelCell(header = "Stamp_Duty")
    private String duty;

    @ExcelCell(header = "Government_Levy")
    private String levy;

    @ExcelCell(header = "RTA_Amount")
    private String rtaAmount;

    @ExcelCell(header = "Premium_Collected")
    private double premium;

    @ExcelCell(header = "Vehicle_Type")
    private String vehicleType;

    @ExcelCell(header = "Payment Method")
    private String paymentMethod;

    @ExcelCell(header = "Location")
    private String branchCode;

    @ExcelCell(header = "Policy_No")
    private String alternativeRef;

    @ExcelCell(header = "Policy_No")
    private String firstName;

    @ExcelCell(header = "Policy_No")
    private String lastName;

    @ExcelCell(header = "Policy_No")
    private String agent;

    @Transient
    private Boolean hasError=Boolean.FALSE;

    private String errorReason;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "batch_id", referencedColumnName = "id")
    private Batch batch;

    public PremiumItem createPremiumItem(Premium p){
        this.premium=p.getPremium();
        this.customerAddress=p.getAddress()+" "+p.getAddress2();
        this.alternativeRef=p.getAlternativeRef();
        this.coverEndDate=p.getCoverEndDate();
        this.dob=p.getDob();
        this.duty=p.getDuty();
        this.fullName=p.getFullName();
        this.levy=p.getLevy();
        this.phone=p.getPhone();
        this.manufactureYear=p.getManufactureYear();
        this.rowId=p.getRowId();
        this.paymentMethod=p.getPaymentMethod();
        this.vehicleRegNo=p.getVehicleRegNo();
        this.vehicleMake=p.getMake();
        this.vehicleModel=p.getModel();
        this.vehicleType=p.getVehicleType();
        this.coverStartDate=p.getCoverStartDate();
        this.rtaAmount=p.getRtaAmount();
        this.sumInsured=p.getSumInsured();
        this.premiumRow=p.getRow();
        this.errorReason=p.getReason();
        return this;
    }


}
