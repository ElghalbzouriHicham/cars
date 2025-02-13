import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor:  HttpInterceptorFn =(req, next)=>{
    const authToken = localStorage.getItem('authToken');
    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh")
    if (authToken) {
      const authReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${authToken}`)
      
      });
      return next(authReq);
    }
    return next(req);
  }