---
title: "Rails Reporting Done Fast Part I"
author:
  name: "David Conner"
tags: "mysql postgres postgresql ruby views functions reporting rails reports pdf csv xls"
---

### Agile Reporting

I've been doing a lot of reporting for a client lately. Since 2011, I've been maintaining a gem called 
[Skiima](https://github.com/dcunited001/skiima).  And even though I didn't know 
what the concept was when I started, what I've created is a **gem** for **containerizing**
SQL DDL Statements.  

In other words, if you have a multi-database application, you can use Skiima to containerize an application 
that references these databases.  Say your project has service-oriented architecture and has 3 API's: a
Authentication API with Users/Profiles, an Events API and a Donations API, each with their own database.  Then
you can create a Reports API with it's own database and use Skiima to create reports using views, functions and 
stored procedures that refer to the Auth, Events and Donations databases.  

You can use ActiveRecord to create view-backed report models and use Mongo to cache the data results
of those reports.  Or you can use view-backed models and scheduled Resque jobs to distill and retrieve data for 
a dashboard.  With Skiima, you can keep these SQL DDL objects in source control **and** *easily* deploy your views, 
functions, stored procedures to multiple environments.  

> Yep, this is where some Rails devs start throwing tomatoes.

### Here's my response to the naysayers

I get this every time I suggest using my gem and view-backed models for reporting.

> But David - ORM and ActiveRecord to *saves you* from the *evils* of **SQL**!

But the truth is - SQL is simple and it just works!  Queue up the ** *SQL Doesn't Scale* **
arguments here.  But really - SQL does scale - to a point.  My strategy for **Reporting** in *early* 
**Rails Applications** works!  Granted, SQL Reporting isn't appropriate for a sharded database 
or when you've got **1,000,000+ users**.

> But - it allows startups to make invaluable insights about their data - early on!
> When there's still a chance to pivot.

And here's my argument: SQL Reporting works to a point.  When your application is big enough
to have problems of scale, then you've likely now got the budget to deal with those problems.  
But before you're application is big enough to warrant tackling problems of scale, then
you need to be willing to use the tools you can to get the data you need. 

> **Y.A.G.N.I.** and **Lean Startups** 

### Using Skiima allows you to make Rails Reporting agile
  
Our client has several hundred thousand users and view-backed reports in Rails is working
great for us so far!  We are able to respond quickly to change requests, which are a given when writing reports.  
We can easily add/remove columns, create new filters, change the grouping, update 
the logic for aggregated data and apply drastic changes to CSV, XLS and PDF templates, all
without flinching.  And most importantly - without draining our client's wallet!

And that's key for young startups and young webapps - staying agile.  There's enough to do just 
building the application.  Reporting is like icing on top of the cake - you've got to bake the cake
first.  And since our reporting is agile, we can stay focused on building customer-facing features,
while building reports without breaking a sweat.

### Part II - Using [Skiima](https://github.com/dcunited001/skiima) to Enable Agile Reporting

Coming Soon...

