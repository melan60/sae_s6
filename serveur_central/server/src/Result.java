import org.bson.types.ObjectId;

import java.util.List;

public class Result {
    private ObjectId id;
    private ObjectId experience;
    private float reactTime;
    private float execTime;
    private int error;

    // Necessary to decode the class using a POJO (MongoDriver)
    public Result() {

    }

    public Result(ObjectId id, ObjectId experience, float reactTime, float execTime, int error) {
        this.id = id;
        this.experience = experience;
        this.reactTime = reactTime;
        this.execTime = execTime;
        this.error = error;
    }

    public Result(ObjectId experience, float reactTime, float execTime, int error) {
        this.experience = experience;
        this.reactTime = reactTime;
        this.execTime = execTime;
        this.error = error;
    }

    public int getError() {
        return error;
    }

    public void setError(int error) {
        this.error = error;
    }

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public ObjectId getExperience() {
        return experience;
    }

    public void setExperience(ObjectId experience) {
        this.experience = experience;
    }

    public float getReactTime() {
        return reactTime;
    }

    public void setReactTime(float reactTime) {
        this.reactTime = reactTime;
    }

    public float getExecTime() {
        return execTime;
    }

    public void setExecTime(float execTime) {
        this.execTime = execTime;
    }
}