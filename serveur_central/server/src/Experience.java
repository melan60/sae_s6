import org.bson.types.ObjectId;

import java.util.List;

public class Experience {
    private ObjectId id;
    private String name;
    private String typeStimulus;
    private String distraction;
    private List<ObjectId> modules;

    public Experience(ObjectId id, String name, String typeStimulus, String distraction, List<ObjectId> modules) {
        this.id = id;
        this.name = name;
        this.typeStimulus = typeStimulus;
        this.distraction = distraction;
        this.modules = modules;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTypeStimulus() {
        return typeStimulus;
    }

    public void setTypeStimulus(String typeStimulus) {
        this.typeStimulus = typeStimulus;
    }

    public String getDistraction() {
        return distraction;
    }

    public void setDistraction(String distraction) {
        this.distraction = distraction;
    }

    public List<ObjectId> getModules() {
        return modules;
    }

    public void setModules(List<ObjectId> modules) {
        this.modules = modules;
    }
}
