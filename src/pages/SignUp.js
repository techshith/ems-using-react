import React, { useState } from "react";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';
import "../App.css";
import bodyImage from '../assets/images/backs.jpg';
import { useNavigate } from 'react-router-dom';







function CreateAccount() {

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [role, setRole] = useState('');
  const [manager, setManager] = useState('');
  const [error, setError] = useState('');

    const handleCreateAccount = async () => {

      const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

    try {

      if (name.trim() === '') {
        setError('Name Not Entered. Please enter your name');
        return;
      }
      if (surname.trim() === '') {
        setError('Surname Not Entered. Please enter your surname');
        return;
      }
      if (!birthDate) {
        setError('Please enter your birth date');
        return;
      }
      if (employeeNumber.trim() === '') {
        setError('Employee Number not entered. Please enter your city employee number');
        return;
      }
     
      if (role.trim() === '') {
        setError('Role not selected. Please select your role.');
        return;
      }

      if (salary.trim() === '') {
        setError('Salary not entered. Please enter your salary.');
        return;
      }

      if (email.trim() === '') {
        setError('Email Not Entered. Please enter your email address.');
        return;
      }
 
      if (!isValidEmail(email)) {
        setError('Invalid Email. Please enter a valid email address.');
        return;
      }      
  
      if (password.trim() === '') {
        setError('Password Empty. Please enter a password.');
        return;
      }
 
      if (password.length < 5)
      {
        setError('Password Too Short. Please enter at least 5 characters.');
        return;
      }

      await createUserWithEmailAndPassword(auth, email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
       
        console.log('Registered with:', user.email);
    })


  
      const user = auth.currentUser;
      const uid = user.uid;

      //const userRef = addDoc(collection(firestore, 'users');
      const userRef = doc(firestore, 'employees', uid);
      await setDoc(userRef, {
        name,
        surname,
        email,
        birthDate,
        employeeNumber,
        salary,
        role,
        manager,
      });

      console.log('User added to Firestore with ID: ', userRef.id);

      // Redirect to another page (e.g., dashboard) after successful account creation
      navigate('/home');
    } catch (error) {
      console.error('Error creating account:', error.message);
      setError(error.message);
    }
  };


  return (
    <div className="account-container">
    <img src={bodyImage} alt="Background Wall" className="body-image" />
      
      <div className="card p-4">
      {/* <h3>Create Account</h3 >  */}
        <fieldset className="section personal">
          <legend>Personal Details</legend>
          
          <div className="grid">
            <label htmlFor="name">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="lastName">
              Last Name:
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />

            <label htmlFor="date">
             Birth Date:
            </label>
            <input
              type="date"
              className="form-control"
              id="birthDate"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />

            <label htmlFor="employeeNumber">
              Employee No
            </label>
            <input
              type="number"
              className="form-control"
              id="name"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              required
            />

            <label htmlFor="manager">
              Manager
            </label>
            <input
              type="text"
              className="form-control"
              id="manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
            />


            <label htmlFor="role">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            />

            <label htmlFor="salary">
              Salary
            </label>
            <input
              type="number"
              className="form-control"
              id="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              required
            />
          </div>
        </fieldset>
        
        <fieldset className="section account">
          <legend>Account Details</legend>
          
          <div className="grid">
          <label htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <label htmlFor="email">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </fieldset>
        {error && <div className="text-danger mb-3">{error}</div>}
        <button className="btn btn-primary" onClick={handleCreateAccount}>Create Account</button>
        
      </div>
    </div>
  );

}

export default CreateAccount;
