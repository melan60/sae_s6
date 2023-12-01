import org.bson.types.ObjectId;

import java.util.List;

public class Experience {
    private ObjectId _id;
    private String name;
    private String typeStimulus;
    private String distraction;
    private int numero;
    private List<ObjectId> modules;

    // Necessary to decode the class using a POJO (MongoDriver)
    public Experience() {}

    public Experience(ObjectId id, String name, String typeStimulus, String distraction, int numero, List<ObjectId> modules) {
        this._id = id;
        this.name = name;
        this.typeStimulus = typeStimulus;
        this.distraction = distraction;
        this.numero = numero;
        this.modules = modules;
    }

    public ObjectId getId() {
        return _id;
    }

    public void setId(ObjectId id) {
        this._id = id;
    }

    public int getNumero() {
        return numero;
    }

    public void setNumero(int numero) {
        this.numero = numero;
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
