# Pipe to Browser
P2B allows one to pipe anything from shell console to the browser. Data being piped to the browser then is displayed in a graphical and formatted way by a "viewer" Viewers are pluggable pieces of code that know how to handle and display a stream of data.

For example one can do:

``
echo "Hi!" | p2b users/jane@google.com/chrome/p2b/jane/console
``

or

``
cat cat.jpg | p2b -binary users/jane@google.com/chrome/p2b/jane/image
``

where **users/jane@google.com/chrome/p2b** is the Object name where p2b service is running in the browser. The suffix **console** or **image** specifies what viewer should be used to display the data.

Please see the help page inside the P2B application for detailed tutorials.

## Building and Running
To build
``
make
``
To run
``
make go/bin/p2b #Builds the p2b binary
make start #Starts a web server at 8080
``
and then navigate to http://localhost:8080 and publish under a name such as 'foo'
and run p2b rpc under vbash  with commands such as
```
# run vbash
$V23_ROOT/release/go/src/v.io/x/ref/cmd/vbash

# run a sample p2b command
echo "Hello World" | go/bin/p2b users/<email-address>/chrome/p2b/foo/console

```

To stop simply Ctrl-C the console that started it

To clean
``
make clean
``