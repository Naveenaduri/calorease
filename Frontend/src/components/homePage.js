import React from 'react';
import Menu from './menu';
import img_1 from '../images/img_1.jpg';
import img_2 from '../images/img_2.jpg';
import img_3 from '../images/img_3.jpg';
import img_4 from '../images/img_4.jpg';
import img_5 from '../images/img_5.jpg';
import img_6 from '../images/img_6.jpg';

const HomePage = () => {
  return (
    <>
    <Menu/>
    <div class="site-section py-4">
  <div class="container">
    <div class="row mb-1">
      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_2} alt="Image" height={240} class="img-fluid"/>
          <div class="media-image-body">
              <h2 class="font-secondary text-uppercase">User Page</h2>
              <p>Enables user registration with personal details, email, password, and optional verification for security.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_1} alt="Image" height={240} class="img-fluid"/>
          <div class="media-image-body">
            <h2 class="font-secondary text-uppercase">Workout Tracker</h2>
            <p>Records the number of calories burned and total minutes spent exercising for each workout session.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_4} alt="Image" height={240} class="img-fluid"/>
          <div class="media-image-body">
            <h2 class="font-secondary text-uppercase">Dietary Information</h2>
            <p>Allows users to log daily meals and monitor caloric intake to align with their fitness goals.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_3} alt="Image" height={240} class="img-fluid"/>
          <div class="media-image-body">
            <h2 class="font-secondary text-uppercase">Calories Burned Summary</h2>
            <p>Displays an overview of total calories burned over time, helping users stay motivated and track progress.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_5} alt="Image" height={240} class="img-fluid"/>
          <div class="media-image-body">
            <h2 class="font-secondary text-uppercase">Workout Analysis</h2>
            <p>Provides insights into total workout minutes each week, visualizing commitment to fitness goals.</p>
          </div>
        </div>
      </div>

      <div class="col-md-6 col-lg-4 mb-5">
        <div class="media-image">
          <img src={img_6} alt="Image" height={240} class="img-fluid"/> 
          <div class="media-image-body">
            <h2 class="font-secondary text-uppercase">Progress Insights</h2>
            <p>Combines calorie burn and workout duration trends to show improvements in fitness over time.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

    </>
  );
};

export default HomePage;
