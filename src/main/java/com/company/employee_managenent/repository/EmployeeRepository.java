package com.company.employee_managenent.repository;

import com.company.employee_managenent.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Custom query: find employees by department
    List<Employee> findByDepartment(String department);

    // Custom query: find employees with salary greater than given value
    List<Employee> findBySalaryGreaterThan(Double salary);
}