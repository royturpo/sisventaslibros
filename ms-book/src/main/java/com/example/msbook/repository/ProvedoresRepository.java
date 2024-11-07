package com.example.msbook.repository;

import com.example.msbook.entity.Categoria;
import com.example.msbook.entity.Provedores;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProvedoresRepository extends JpaRepository<Provedores,Integer> {

}
