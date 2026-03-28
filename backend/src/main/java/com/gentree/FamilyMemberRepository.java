package com.gentree;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FamilyMemberRepository extends JpaRepository<FamilyMember, Long> {

    Optional<FamilyMember> findByMemberId(String memberId);

    List<FamilyMember> findByParentId(Long parentId);

    @Query("SELECT m FROM FamilyMember m WHERE m.parentId IS NULL")
    List<FamilyMember> findRootMembers();

    @Query("SELECT m FROM FamilyMember m WHERE LOWER(m.middleName) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(m.lastName) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<FamilyMember> searchByMiddleOrLastName(String query);
}