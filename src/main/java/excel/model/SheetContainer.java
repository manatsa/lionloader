package excel.model;

import org.apache.poi.ss.usermodel.Sheet;

import java.util.List;

/**
 * A simple POJO that holds sheet level data.
 * 
 * @author ssp5zone
 */
public class SheetContainer {
	private Sheet sheet;
	private List<?> data;
	private String heading = "";

	public void setSheet(Sheet sheet) {
		this.sheet = sheet;
	}

	public void setData(List<?> data) {
		this.data = data;
	}

	public void setHeading(String heading) {
		this.heading = heading;
	}

	public Sheet getSheet() {
		return this.sheet;
	}

	public List<?> getData() {
		return this.data;
	}

	public String getHeading() {
		return this.heading;
	}
}
