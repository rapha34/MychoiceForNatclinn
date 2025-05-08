package fr.inra.MyChoice.util;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class TestDB {
    public static void main(String[] args) {
        String jdbcUrl = "jdbc:mariadb://localhost:3306/mychoice_v2?verifyServerCertificate=false&useSSL=false";
        String user = "root"; // à adapter
        String password = "pic3.14"; // à adapter

        try (Connection conn = DriverManager.getConnection(jdbcUrl, user, password)) {
            System.out.println("Connexion réussie à la base de données !");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
