package com.dhtmlx.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    @GetMapping("/viewtest.do")
    public String viewTest(HttpServletRequest request, Model model) {
        return "test";
    }
}
