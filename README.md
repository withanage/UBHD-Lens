## Description

Browser-based HTML Viewer for Journal Articles and Monographs based on JATS Standard XML files.based on elifescience Lens Viewer.

Functionality for BITS (Book extension for JATS)  is limited and constantly improved.



#### Implemented Extensions

| Feature |	Ready | Live Links in monographs |
| --- | --- | --- |
| Audio/Video from external repositories| ✓ |[demo](https://heiup.uni-heidelberg.de/reader/index/310/310-69-79515-1-10-20171115.xml#figures) |
| Citation blocks (with unique IDs)   | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/43/43-68-231-1-10-20151008.xml#content/box_25) |
| Citations  containing tables   | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/416/416-68-83604-1-10-20181217.xml#content/heading_48) |
| Footnotes formatting support   | ✓ |  [demo](https://heiup.uni-heidelberg.de/reader/index/48/48-68-599-1-10-20160428.xml#footnotes/article_footnote_60)|
| Footnotes internal navigation into references   | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/310/310-69-79515-1-10-20171115.xml#figures)|
| Images (scaled by click)   | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/310/310-69-79515-1-10-20171115.xml#figures/figure_1/fullscreen)|
| Paragraph formatting using CSS-Stylesheets   | ✓ | |
| Quotes (unique ids, formatting supported)  | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/48/48-68-599-1-10-20160428.xml#content/quote_2)|
| Reader panel scrollbar (on right side)  | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml) |
| Section metadata for monographs   | | |
| - Section authors/contributors | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml#content/heading_39) |
| - Section title| ✓ |[demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml#content/heading_39)  |
| - Section Abstract | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml#content/heading_39)  |
| Speech-Element | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/48/48-68-599-1-10-20160428.xml#content/speech_27)|
| Table display in reading panel | ✓ | [demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml#content/html_table_2)|
| Table (unique id for reference)   | ✓ |[demo](https://heiup.uni-heidelberg.de/reader/index/345/345-68-81466-2-10-20180620.xml#content/html_table_2) |
| Table formatting using JATS XML Attributes and CSS-Stylesheets | ✓ |  [Local example](http://localhost:8000/?url=data/example.xml/)|
| Resizable reader panel | :construction_worker: | |
| Software Source-code in Lens |:construction_worker: |[ticket](https://gitlab.ub.uni-heidelberg.de/wit/verlag-portale/issues/161) |


#### Feature limitations
| Feature |	 Value | Remarks |
| --- | --- | --- |
| Browser support  | Google Chrome, Firefox, Opera,  Microsoft Edge , Safari| Limited support for internet explorer |
| Minimum recommended resolution  | 768 * 1024 (iPad) | Although smaller resolutions may work |


## Installation



 ```
# Clone source repository 
git clone https://github.com/withanage/UBHD-Lens.git
cd UBHD-Lens

# Install npm for your distribution e.g. sudo apt-get install npm

# Install gulp
npm install gulp gulp-sass gulp-uglify browserify gulp-rename through2 path gulp-livereload rename st

#  install submodues
npm install

 ```
 
## Compile

```
gulp
```

Distribution will be generate in `dist` folder. Change to dist folder.

### Local
```
cd dist/
firefox index.html # Or  use the open file in your browser.
```
or use any in-built server e.g.
* python -m SimpleHTTPServer 4001
* php -S localhost:4001
* node server



### Server integraton
Copy tie  `dist` folder into a server environment and make sure the XML file is loaded accodingly.
You can change the file rendering mechanism, `function qs()` in the index.html file.



##  Test examples

Example assumes port **4001**. Change port accordingly.
 
* [Features](http://localhost:4001/?url=data/example.xml)
* [Sample Article](http://localhost:4001/?url=data/bmj_example.xml)
* [Sample Article with MathML ](http://localhost:4001/?url=data/pnas_sample.xml)


## Development

## Run server application

```bash
node server
```



## Developpers

* Dulip Withanage


