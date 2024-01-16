package com.dhtmlx.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class TestController {

    @GetMapping("/list.do")
    public String viewList(HttpServletRequest request, Model model) {
        return "list";
    }

    @GetMapping("/detail.do")
    public String viewDetail(HttpServletRequest request, Model model) {
        return "detail";
    }
}
