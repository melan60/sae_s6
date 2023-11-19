import org.bson.types.ObjectId;

import java.util.List;

public class Result {
    private ObjectId id;
    private List<ObjectId> experience;
    private int reactTime;
    private int execTime;

    public Result(ObjectId id, List<ObjectId> experience, int reactTime, int execTime) {
        this.id = id;
        this.experience = experience;
        this.reactTime = reactTime;
        this.execTime = execTime;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public List<ObjectId> getExperience() {
        return experience;
    }

    public void setExperience(List<ObjectId> experience) {
        this.experience = experience;
    }

    public int getReactTime() {
        return reactTime;
    }

    public void setReactTime(int reactTime) {
        this.reactTime = reactTime;
    }

    public int getExecTime() {
        return execTime;
    }

    public void setExecTime(int execTime) {
        this.execTime = execTime;
    }
}