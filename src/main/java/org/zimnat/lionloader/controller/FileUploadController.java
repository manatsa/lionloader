package org.zimnat.lionloader.controller;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

/**
 * @author :: codemaster
 * created on :: 11/5/2023
 */

@RestController
@RequestMapping("api/upload")
public class FileUploadController {

    @PostMapping(value="/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getFile(@RequestParam MultipartFile file) throws IOException {
        String filename=file.getOriginalFilename();
        File appFile=File.createTempFile(filename.substring(0, filename.lastIndexOf("."))+".", filename.substring(filename.lastIndexOf(".")+1)); //new File(multipartFile.getOriginalFilename());
        /*try (OutputStream os = new FileOutputStream(appFile)) {
            os.write(file.getBytes());
        }*/
        file.transferTo(appFile);
        System.err.println("File Path::"+appFile.getAbsolutePath());
        return ResponseEntity.ok("Upload was successful!");
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
}
