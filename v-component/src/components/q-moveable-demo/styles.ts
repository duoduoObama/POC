/* playground-fold */
import {css} from 'lit';

export const styles = css` 
.focus {
  outline: var(--force-border);
  box-shadow: var(--force-box-shadow);
  box-sizing: border-box;
  overflow: hidden;
}

.focusBind {
  outline: 5px solid red;
  box-sizing: border-box;
  overflow: hidden;
}
.container {
  height: 100%;
  width: 100%;
} 
#container {
  height: 100%;
  width: 100%;
} 
#tabs {
  // overflow: hidden;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  height: 30px;
  display: flex;
}
#tabs li {
  cursor: pointer;
}
#tabs .add {
  font-size: 20px; 
  font-weight: 800;
  padding: 0 10px;
}
#tabs a {
  float: left;
  position: relative; 
  height: 0;
  line-height: 30px;
  text-transform: uppercase;
  text-decoration: none;
  color: #fff;
  /* border-right: 30px solid transparent; */
  /* border-bottom: 30px solid #3D3D3D; */
  border-bottom-color: #777;
  opacity: .3;
  filter: alpha(opacity=30);
  display: block;
  height: 30px;
  padding:0 20px;
  text-align: center;
  background-color: #3d3d3d;
}
// #tabs a:hover,  #tabs a:focus {
//   background-color: #2ac7e1;
//   opacity: 1;
//   filter: alpha(opacity=100);
// }
#tabs a:focus {
  outline: 0;
}
#tabs #current { 
  border-bottom-color: #3d3d3d;
  opacity: 1;
  filter: alpha(opacity=100);
} 
#titleIcon {
  display: none;
  position: absolute;
  top: 0;
  right: 4px;
}
#titleIcon .iconMenu {
  width: 130px;
  display: none;
  position: absolute;
  top: 20px;
  left: -40px;
  background-color: #fff;
  box-shadow: 0 0 2px 2px #CACACA;
  z-index: 100;
}

#titleIcon .iconMenu > div:hover {
  background-color: #E9E9E9;
}

#content {
  border-top: 2px solid #3d3d3d; 
  height: calc(100% - 30px);
}

}
#content h2,  #content h3,  #content p {
  margin: 0 0 15px 0;
}
/* Demo page only */

#about {
  color: #999;
  text-align: center;
  font: 0.9em Arial, Helvetica;
}
#about a {
  color: #777;
}
.content-panel{
  height: 100%;
  width: 100%;
  position: relative; 
}`;

/* playground-fold-end */
