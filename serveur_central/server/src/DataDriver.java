import java.util.List;

public interface DataDriver {

    // initialize the driver (if needed)
    public boolean init();
    public String addUser(User user);
    public String addResults(String idExp, int reactTime, int execTime, User user);
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
