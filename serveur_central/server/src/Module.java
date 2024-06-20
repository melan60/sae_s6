import org.bson.types.*;

import java.util.List;

public class Module {

    private ObjectId id;
    private String name;
    private String uc;
    private String description;

    public Module() {
    }

    public Module(String name, String uc, String description) {
        this.name = name;
        this.uc = uc;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public String getUc() {
        return uc;
    }

    public void setUc(String uc) {
        this.uc = uc;
    }
}
