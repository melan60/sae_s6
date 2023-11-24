import org.bson.types.ObjectId;

import java.util.List;

public class User {
    private ObjectId id;
    private String name;
    private String firstName;
    private String password;
    private String email;
    private String age;
    private String gender;
    private String typeUser;
    private List<Result> results;

    public User(ObjectId id, String name, String firstname, String password, String email, String age, String gender, String typeUser, List<Result> results) {
        this.id = id;
        this.name = name;
        this.firstName = firstname;
        this.password = password;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.typeUser = typeUser;
        this.results = results;
    }

    public User(String name, String firstname, String password, String email, String age, String gender, String typeUser) {
        this.name = name;
        this.firstName = firstname;
        this.password = password;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.typeUser = typeUser;
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

    public String getFirstname() {
        return firstName;
    }

    public void setFirstname(String firstname) {
        this.firstName = firstname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getTypeUser() {
        return typeUser;
    }

    public void setTypeUser(String typeUser) {
        this.typeUser = typeUser;
    }

    public List<Result> getResults() {
        return results;
    }

    public void setResults(List<Result> results) {
        this.results = results;
    }
}
