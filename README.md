Customized Lens Viewer for OMP Frontend
========
# Local development
Following steps show how you can setup a test environment.
# Installation
 * Please install a git  client of your choice,  if your system does not have it.
 * Clone the  git repository using command line or with the synchronisation function in your git client of your choice.
 ```
 git clone https://github.com/withanage/UBHD-Lens.git
 ```
 * Move to the folder
 ```
  cd UBHD-Lens
 ```
 * Checkout test environemnt
 ```
  git checkout  local
 ```
 * Move to the `dist` folder 
 ```
  cd dist
 ```
 * Open the file in the browser either navigating to it or in the command line tool
 ```
 firefox  index.html
 ```
 

# Execution  as a Server application

 * Use any local HTTP Server or the python's in built server and navigate to the `UBHD-Lens/dist` folder
 ```
  python -m SimpleHTTPServer
 ```
 * Open your browser and navigate to:
 ```
  http://localhost:8000/?url=data/example.xml/
 ```
 * If you want to test for other files please copy the files into the folder 
 ```
  cd UBHD-Lens/data/
 ```
 * Use the file name
 ```
  http://localhost:8000/?url=data/myfile.xml/
 ```
 
 



