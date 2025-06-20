# inprintzOrdering
Trying to create an order page

Inprintz currently takes orders through email and phone, but this isn't very organized. This project will attempt to create a database that is both accessible by the employees, and clients can make requests to order through the website. All orders will be placed on an order table with different states. I am thinking that an order can be put into multiple states: Completed, In-Progress, Placed, Cancelled. All orders can be searched using an order number. 

An order has a:
order number
state; completed, in-progress, placed, cancelled
data: 
list: quantity material size image

Completed:
An order is considered complete once all posters have been printed and it has been paid for, and is ready to be picked up/shipped. 

In-progress: 
Posters are currently being printed and designed, or have not been paid for.

Placed:
Projects are placed in a priority queue and are waiting to be placed in the In-progress state. Priority is based on time.

Cancelled: 
Project is placed in a reject state. Idk what I would do here. 

order is sent to the placed queue. 
