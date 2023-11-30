import java.util.List;

public interface DataDriver {

    // initialize the driver (if needed)
    public boolean init();
    public String addUser(User user);
    public String addResults(String idExp, float reactTime, float execTime, int nbErrors, User user);
    public int getLastExperience();
    //{
    //  "result": {
    //    "experience": "457870657269656e63652031",
    //    "reactTime": 10,
    //    "execTime": 5
    //  },
    //  "user": {
    //    "name": "John",
    //    "firstName": "Doe",
    //    "password": "mypassword",
    //    "email": "john@example.com",
    //    "age": 30,
    //    "gender": "Masculin",
    //    "results": []
    //  }
    //}
}
