
Voting Application
what???
A functionality where user can vote to the one of given set of candidates


voting app functionality

1. user can Login/Signup.
2. user can login only with unique aadhar card number & password.
3. user can see their profile.
4. user can change their password.
5. user can see the list of candidates.
6. user can give vote to the one of the candidates & after voting can't able to vote again.
7. there is a route showing the list of candidates & their live vote counts, sorted by their vote counts.
8. there should be one admin who can only manage the table of candidates & he can't able to vote at all.


----------------------------------------------------

Routes : 

User Authentication :
    /user/signup: POST - Create a new user account.
    /user/login: POST - Log in to an existing account[using aadhar & password]

voting : 
   /candidates: GET - Get the list of candidates.
   /candidates/vote/:candidateId: POST - Vote for a specific candidate.

Vote Counts:
    /candidates/vote/counts: GET - Get the list of candidates sorted by their vote counts

User Profile: 
    /user/profile: GET - Get the user's profile.
    /user/profile/password:  PUT - update the users Password.

Admin Candidate Management :
    /candidates: POST - Create a new candidate.
    /candidates/:candidateId: PUT - Update an existing Candidate.
    /candidates/:candidateId: DELETE - Delete a specific Candidate from the list.



