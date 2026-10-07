package com.opdModule.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 20)
    private String gender;

    @Column(nullable = false)
    private Integer age;

    @Column(nullable = false, length = 30)
    private String phoneNumber;

    protected Patient() {
    }

    public Patient(String name, String gender, Integer age, String phoneNumber) {
        this.name = name;
        this.gender = gender;
        this.age = age;
        this.phoneNumber = phoneNumber;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getGender() { return gender; }
    public Integer getAge() { return age; }
    public String getPhoneNumber() { return phoneNumber; }
}
