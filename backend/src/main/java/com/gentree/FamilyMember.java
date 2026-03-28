package com.gentree;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "family_members")
public class FamilyMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @NotBlank(message = "Member ID is required")
    private String memberId;

    @Column(nullable = false)
    @NotBlank(message = "First name is required")
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    @NotBlank(message = "Last name is required")
    private String lastName;

    @Column(nullable = false)
    @NotNull(message = "Date of birth is required")
    private LocalDate dob;

    private LocalDate dod;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Status status;

    private String photoPath;

    @Column(name = "parent_id")
    private Long parentId;

    public enum Status {
        Alive, Dead
    }

    // Constructors
    public FamilyMember() {}

    public FamilyMember(String memberId, String firstName, String middleName, String lastName,
                       LocalDate dob, LocalDate dod, Status status, String photoPath, Long parentId) {
        this.memberId = memberId;
        this.firstName = firstName;
        this.middleName = middleName;
        this.lastName = lastName;
        this.dob = dob;
        this.dod = dod;
        this.status = status;
        this.photoPath = photoPath;
        this.parentId = parentId;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getMiddleName() { return middleName; }
    public void setMiddleName(String middleName) { this.middleName = middleName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public LocalDate getDob() { return dob; }
    public void setDob(LocalDate dob) { this.dob = dob; }

    public LocalDate getDod() { return dod; }
    public void setDod(LocalDate dod) { this.dod = dod; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public String getPhotoPath() { return photoPath; }
    public void setPhotoPath(String photoPath) { this.photoPath = photoPath; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }
}