# Pipe2Browser
This Vanadium application makes it possible to pipe anything from any Unix-like console to the browser using the shell's regular pipe functionality. Data being piped to the browser then is displayed in a graphical and formatted way by a **viewer**. Viewers are pluggable pieces of code that know how to handle and display a stream of data.

For example:

```
echo "Hi!" | p2b users/jane@google.com/chrome/p2b/jane/console
```

<img src="https://cloud.githubusercontent.com/assets/2099009/7381405/e82f7438-edb7-11e4-971b-47b987df832a.png" alt="Screenshot of P2B with the console viewer showing text hello in different languages." width=600/>

or

```
cat cat.jpg | p2b users/jane@google.com/chrome/p2b/jane/image
```

<img src="https://cloud.githubusercontent.com/assets/2099009/7381409/eabbbaf4-edb7-11e4-838c-aa5bc18fe3de.png" alt="Screenshot of P2B with the console viewer showing a photo of a cat." width=600/>

where *users/jane@google.com/chrome/p2b/jane* is the object name where p2b service
is running in the browser. The suffix *console* or *image* specifies what
viewer should be used to display the data.

P2B supports several built-in plugins such as console, image viewer, log viewer, git status viewer and dev/null. Users can create their own plugins and plug them remotely as well.

Users can also redirect pipes of data to other instances of P2B.

<img src="https://cloud.githubusercontent.com/assets/2099009/7381411/ec8a6970-edb7-11e4-8a8e-771acd04f2d6.png" alt="Screenshot of P2B with the redirect dialog action showing a list of P2B instances to redirect to." width=600/>

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
