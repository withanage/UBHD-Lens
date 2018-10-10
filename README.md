# Description
=======

Browser-based HTML Viewer for Journal Articles and Monographs based on JATS Standard XML files.based on elifescience Lens Viewer.

Limited functionality for BITS (Book extension for JATS) is available.

Implemented Extensions

| Feature |	Ready | |
| --- | --- | --- |
| Audio/Video from external repositories| ✓ | |
| Footnotes formatting support   | ✓ | |
| Footnotes internal navigation     for references   | ✓ | |
| Paragraph formatting using CSS-Stylesheets   | ✓ | |
|Section metadata for monographs   | |
| - Section authors/contributors | ✓ | |
| - Section title| ✓ | |
| - Section Abstract | ✓ | |
| Table display in reading panel | ✓ | |
| Table formatting using JATS XMl Attributes and CSS-Stylesheets | ✓ | |



## Installation



 ```
# Clone the  git repository 
git clone https://github.com/withanage/UBHD-Lens.git
#  Move to the folder
cd UBHD-Lens
# Install npm for your distribution
# Install gulp
npm install gulp gulp-sass gulp-uglify browserify gulp-rename through2 path gulp-livereload rename st
#  install all-modules
npm install
 ```
 


## Run server application 

```bash
gulp server
```

## Open your browser 
 
* [Features example](http://localhost:8000/?url=data/example.xml/)
* [Sample Article](http://localhost:8000/?url=data/bmj_example.xml/)
* [Article with MathML ](http://localhost:8000/?url=data/pnas_sample.xml/)






