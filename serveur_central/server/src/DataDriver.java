import java.util.List;

public interface DataDriver {

    // initialize the driver (if needed)
    boolean init();
    String addUser(User user);
    String addResults(String idExp, float reactTime, float execTime, int nbErrors, User user);
    int getLastExperience();
    User getUser();
}
