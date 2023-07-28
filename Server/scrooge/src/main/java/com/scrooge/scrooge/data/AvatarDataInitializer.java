package com.scrooge.scrooge.data;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component
public class AvatarDataInitializer implements CommandLineRunner {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) {
        insertInitialData();
    }

    private void insertInitialData() {
        String[] names = {
                "avatar0", "avatar1", "avatar2", "avatar3", "avatar4",
                "avatar5", "avatar6", "avatar7", "avatar8", "avatar9",
                "avatar10", "avatar11", "avatar12", "avatar13", "avatar14",
                "avatar15", "avatar16", "avatar17", "avatar18", "avatar19",
                "avatar20"
        };

        String[] imgAddresses = {
                "static/assets/avatars/0.png", "static/assets/avatars/1.png", "static/assets/avatars/2.png",
                "static/assets/avatars/3.png", "static/assets/avatars/4.png", "static/assets/avatars/5.png",
                "static/assets/avatars/6.png", "static/assets/avatars/7.png", "static/assets/avatars/8.png",
                "static/assets/avatars/9.png", "static/assets/avatars/10.png", "static/assets/avatars/11.png",
                "static/assets/avatars/12.png", "static/assets/avatars/13.png", "static/assets/avatars/14.png",
                "static/assets/avatars/15.png", "static/assets/avatars/16.png", "static/assets/avatars/17.png",
                "static/assets/avatars/18.png", "static/assets/avatars/19.png", "static/assets/avatars/20.png"
        };

        for (int i = 0; i < names.length; i++) {
            String insertQuery = "INSERT INTO avatar (name, img_address) VALUES " +
                    "('" + names[i] + "', '" + imgAddresses[i] + "');";
            entityManager.createNativeQuery(insertQuery).executeUpdate();
        }
    }
}
