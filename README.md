# ElifTech
It's a web application that manages organizational structure for parent and child companies. 
Each company has two properties, they are company name and estimated annual earnings. 
There are two types of companies: 1- Main company, 2 - Sub

- The application allow a user to view/add/edit/delete any company.
- Company name and estimated earnings stored in database
- Show companies like tree

Example:
Name | Company Estimated Earnings | Company Estimated Earnings + Child Companies Estimated Earnings
 -Company1 | 25K$ | 53K$
  --Company2 | 13K$ | 18K$
   ---Company3 | 5K$
  --Company4 | 10K$
  
- Nesting level is not limited
- Single page approach used.
- Any solution demonstrate best practices where appropriate such as SOLID principles.

Web application deployed and link to the app is:
http://eliftech.azurewebsites.net/

There are 2 branches -> master & FrontEnd.
In master we have ElifTechAPI which deploy on azure (http://eliftechdataapi.azurewebsites.net/companies)
and old, unnecessary front end.
In FrontEnd we have new front end which deploy on azure (http://eliftech.azurewebsites.net/).
