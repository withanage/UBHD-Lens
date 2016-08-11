Customized Lens Viewer for OMP Frontend
========
# Local development
Following steps show how you can setup a test environement.
# Installation
 * Please install git,  and python if your system does not have it.
 * Clone the  git repository
 ```
 git clone https://github.com/withanage/UBHD-Lens.git
 ```
 * Move to the folder
 ```
  cd UBHD-Lens
 ```
 * Checkout  test environemnt
 ```
  git checkout  local
 ```
 * Move to the dist folder 
 ```
  cd dist
 ```

# Execution
 * Use any local HTTP Server or the python's in built server.
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
 
 



