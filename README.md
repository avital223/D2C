# D2C - Data to See
An online platform for therapists to analyze and produce reports for their patients, in order to preform a better and easier neuropsychological evaluation.

## What is D2C?
D2C (or Data to See) is an online platform that help therapists diagnose, test and finally produce reports about their patients.
It's a free software. It's server based web that was build using Express, NodeJS, MongoDB, Okta registration and was written in typescript. <br/>
Note: We intend to launch our website on the begining of Sep. 2022.

## A glance to see

_My Users list_

![d2c_1](https://user-images.githubusercontent.com/64374818/175479648-3a5c2b29-a838-45fc-8f73-7f423ca13181.PNG)

_Fill out Questionare_

![d2c_2](https://user-images.githubusercontent.com/64374818/175480236-f40722a8-ba0a-42e1-bd54-5d8d9668ece8.PNG)

_Calculate Tests_

![d2c_3](https://user-images.githubusercontent.com/64374818/175483187-85d9d252-0213-4645-8a71-3b35a6415c3a.PNG)

_Edit Report_

![d2c_4](https://user-images.githubusercontent.com/64374818/175485852-e13271f4-fc96-403f-b1e0-14f4bc1f77e2.PNG)

## What Makes D2C special?
**1. D2C is a free software** <br/>
D2C is a free online website, that any therapist can request access to use for free of charge! (By "Contact us" in the navigator bar)

**2. D2C provides statistical calculations of neuropsychological assessment tests** <br/>
D2C has an online calculator for various of neuropsychological assessment tests. By giving the patient's age, gender and years of education, can evaluate the performance of a certain individual in those neuropsychological testing.

**3. D2C allows therapist to upload CSV with statistical calculations to be saved** <br/>
This platform can interpet a csv file with statistical data about their patient and save the information for later use.

**4. D2C allows patients to fill questionares about themselves in their on free time** <br/>
D2C gives you a easy way to deal with filling out the questionares! As a therpaist you can send your parient an email with links to all the questionares you'd like him to fill, allowing you to save some time in the process of evaluating him.

**5. D2C can compare the results of filled questionare during periouds of time** <br/>
Given an user's hash value, the therapist can compare the answers of their patient from different time the filled it, allowing the therapist to see the progress they made during that period of time.
  
**6. D2C helps you produce an automatic report about your patient** <br/>
By selecting saved filled questionares and saved calculated neuropsychological testing results, this platform produces a report stating the results of the patient, providing insights about his performance and generating text that helps the therapist with writing and producing the final assesment report for their patient.

## Features of this website

* ### As a registered User of the website
  * **Filling a Questionare** via a link sent to the user by the therapist
  * **Seeing the methods this site is using**
  * **Download an example report**
  * **Rate this website**
  * **Contact Us**
* ### As a Therpaist
  * **Listing all my patients**
  * **Add/Delete a new patient**
  * **Fill out a questionare for my patient**
  * **Compare 2 Filled questionares of the same patient**
  * **Upload a CSV file with my patient statistical data to be saved**
  * **Claculate the results of my patient in various neuropsychological assessment tests**
  * **Save the calulations of the patient in various neuropsychological assessment tests**
  * **Choosing saved data of the patient for producing a report**
  * **Edit the automated generated report for the patient**
  * **Download the edited report of my patient as a docx file**
  * **Send an Email to my patient with questionares you want them to fill**
  * **Everyting a user can do**
* ### As an Admin
  * **List all the patients in this site**
  * **Adding a new questionare that therapists can use**
  * **Editing an existing questionare**
  * **Deleting questionare**
  * **Promoting new users to therapists status**
  * **Everyting a therapist can do**

## Database structure
In this website, we use MongoDB that have several clusters:
* A collecting of the questionares - i.e. the questions themselves, possible answers, ect.
* A collection of filled questionares - i.e. the user's hash, the choosen answers, ect.
* A collection of statistical data - this information is used to calculate the performance of a patient in neuropsychological assessment tests.
* A collection of calculated performances of a patients in neuropsychological assessment tests
* A collection of Report structure - helps in generating an aoutomated text for the patient's report.
* A collection of user's hash <br/>
**Note:** this collection contains only the ***date of birth***, ***gender*** and ***years of education*** for each patient, therefore this collection **does not** contain any identifying information about any patient!<br/>
This collection is also estimated to hold no more that 1000 users.

## Using this website
Unfortunetally, due to medical confidentiality and copyright issues, it's not possible to install this web in your computer for it to work smoothly.
However, soon you'll be able to visit the website online (the full URL will be added). 

