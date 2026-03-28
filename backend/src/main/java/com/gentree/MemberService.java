package com.gentree;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.Valid;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/members")
public class MemberService {

    @Autowired
    private FamilyMemberRepository repository;

    // DTO for API responses
    public static class MemberDTO {
        public String memberId;
        public String firstName;
        public String middleName;
        public String lastName;
        public String dob;
        public String dod;
        public String status;
        public String photoPath;
        public String parentId;

        public MemberDTO(FamilyMember member) {
            this.memberId = member.getMemberId();
            this.firstName = member.getFirstName();
            this.middleName = member.getMiddleName();
            this.lastName = member.getLastName();
            this.dob = member.getDob().toString();
            this.dod = member.getDod() != null ? member.getDod().toString() : null;
            this.status = member.getStatus().toString();
            this.photoPath = member.getPhotoPath();
            this.parentId = member.getParentId() != null ? member.getParentId().toString() : null;
        }
    }

    @GetMapping
    public ResponseEntity<List<MemberDTO>> getAllMembers() {
        List<MemberDTO> members = repository.findAll().stream()
                .map(MemberDTO::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemberDTO> getMember(@PathVariable String id) {
        Optional<FamilyMember> member = repository.findByMemberId(id);
        return member.map(m -> ResponseEntity.ok(new MemberDTO(m)))
                    .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MemberDTO> createMember(@Valid @RequestBody CreateMemberRequest request) {
        // Validate DOD >= DOB
        if (request.dod != null && request.dod.isBefore(request.dob)) {
            return ResponseEntity.badRequest().build();
        }

        // Generate hierarchical memberId
        String memberId = generateMemberId(request.parentId);

        FamilyMember member = new FamilyMember();
        member.setMemberId(memberId);
        member.setFirstName(request.firstName);
        member.setMiddleName(request.middleName);
        member.setLastName(request.lastName);
        member.setDob(request.dob);
        member.setDod(request.dod);
        member.setStatus(FamilyMember.Status.valueOf(request.status));
        member.setPhotoPath(request.photoPath);
        member.setParentId(request.parentId);

        FamilyMember saved = repository.save(member);
        return ResponseEntity.ok(new MemberDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemberDTO> updateMember(@PathVariable String id, @Valid @RequestBody UpdateMemberRequest request) {
        Optional<FamilyMember> existing = repository.findByMemberId(id);
        if (!existing.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        FamilyMember member = existing.get();

        // Validate DOD >= DOB
        LocalDate newDod = request.dod != null ? LocalDate.parse(request.dod) : null;
        if (newDod != null && newDod.isBefore(member.getDob())) {
            return ResponseEntity.badRequest().build();
        }

        // Update fields (memberId remains immutable)
        member.setFirstName(request.firstName);
        member.setMiddleName(request.middleName);
        member.setLastName(request.lastName);
        member.setDod(newDod);
        member.setStatus(FamilyMember.Status.valueOf(request.status));
        member.setPhotoPath(request.photoPath);

        FamilyMember saved = repository.save(member);
        return ResponseEntity.ok(new MemberDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable String id) {
        Optional<FamilyMember> member = repository.findByMemberId(id);
        if (!member.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        // Cascade delete children
        deleteMemberAndChildren(member.get());
        return ResponseEntity.noContent().build();
    }

    private void deleteMemberAndChildren(FamilyMember member) {
        List<FamilyMember> children = repository.findByParentId(member.getId());
        for (FamilyMember child : children) {
            deleteMemberAndChildren(child);
        }
        repository.delete(member);
    }

    private String generateMemberId(Long parentId) {
        if (parentId == null) {
            // Root level
            List<FamilyMember> roots = repository.findRootMembers();
            int nextIndex = roots.size() + 1;
            return String.valueOf(nextIndex);
        } else {
            // Child level
            Optional<FamilyMember> parent = repository.findById(parentId);
            if (!parent.isPresent()) {
                throw new IllegalArgumentException("Parent not found");
            }

            List<FamilyMember> siblings = repository.findByParentId(parentId);
            int nextIndex = siblings.size() + 1;
            return parent.get().getMemberId() + "." + nextIndex;
        }
    }

    // Request DTOs
    public static class CreateMemberRequest {
        public String firstName;
        public String middleName;
        public String lastName;
        public LocalDate dob;
        public LocalDate dod;
        public String status;
        public String photoPath;
        public Long parentId;
    }

    public static class UpdateMemberRequest {
        public String firstName;
        public String middleName;
        public String lastName;
        public String dod;
        public String status;
        public String photoPath;
    }
}
