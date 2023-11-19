import org.bson.types.ObjectId;

import java.util.List;

public class User {
    private ObjectId id;
    private String name;
    private String firstname;
    private String password;
    private String email;
    private int age;
    private String gender;
    private String typeUser;
    private List<Result> results;

    public User(ObjectId id, String name, String firstname, String password, String email, int age, String gender, String typeUser, List<Result> results) {
        this.id = id;
        this.name = name;
        this.firstname = firstname;
        this.password = password;
        this.email = email;
        this.age = age;
        this.gender = gender;
        this.typeUser = typeUser;
        this.results = results;
    }

    public User(String name, String firstname, String password, String email, int age, String gender, String typeUser) {
        this.name = name;
        this.firstname = firstname;
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
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
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

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
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
