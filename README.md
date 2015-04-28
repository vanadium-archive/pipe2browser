# Pipe2Browser
P2B allows one to pipe anything from shell console to the browser. Data being
piped to the browser then is displayed in a graphical and formatted way by a
**viewer**. Viewers are pluggable pieces of code that know how to handle and
display a stream of data.

For example one can do:

``
echo "Hi!" | p2b users/jane@google.com/chrome/p2b/jane/console
``

or

``
cat cat.jpg | p2b -binary users/jane@google.com/chrome/p2b/jane/image
``

where *users/jane@google.com/chrome/p2b/jane* is the Object name where p2b service
is running in the browser. The suffix *console* or *image* specifies what
viewer should be used to display the data.

Please see the help page inside the P2B application for detailed tutorials.

## Building and Running

```
# build everything and start a web server at 8000
make start
```
Navigate to [http://localhost:8000](http://localhost:8000) and publish under a name such as 'foo'
then run the `vbash` tool to setup your Vanadium credentials
```
# run vbash to setup your Vanadium credentials
$V23_ROOT/release/go/src/v.io/x/ref/cmd/vbash
```
and then run `p2b` cli client, for instance:
```
# run a sample p2b command
echo "Hello World" | go/bin/p2b users/<<email-address>>/chrome/p2b/foo/console

```

To stop simply Ctrl-C the console that started it

To clean
``
make clean
``
