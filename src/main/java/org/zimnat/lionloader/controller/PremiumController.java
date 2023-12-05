/*
package org.zimnat.lionloader.controller;

import org.apache.poi.excel.ExcelWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zimnat.lionloader.business.domain.Batch;
import org.zimnat.lionloader.business.domain.Premium;
import org.zimnat.lionloader.business.services.BatchService;

import java.util.List;

*/
/**
 * @author :: codemaster
 * created on :: 1/12/2023
 * Package Name :: org.zimnat.lionloader.controller
 *//*


@RestController
@RequestMapping("api/premium")
public class PremiumController {

    @Autowired
    BatchService batchService;

    @Autowired
    PremiumService premiumService;

    @GetMapping("/batch/")
    public ResponseEntity<?> getBatches(){
        return ResponseEntity.ok(batchService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPremiumByBatch(@PathVariable("id") long batchId){
        Batch batch=batchService.get(batchId);
        List<Premium> premiums=premiumService.getByBatch(batch);

        ExcelWriter.write("/", "MyFile.xlsx", premiums);
        return ResponseEntity.ok(premiums);
    }
}
*/
