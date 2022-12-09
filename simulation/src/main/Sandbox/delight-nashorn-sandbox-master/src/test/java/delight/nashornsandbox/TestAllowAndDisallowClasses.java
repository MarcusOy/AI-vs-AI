package delight.nashornsandbox;

import delight.nashornsandbox.exceptions.ScriptCPUAbuseException;
import delight.nashornsandbox.internal.InterruptTest;
import org.junit.Assert;
import org.junit.Test;

import javax.script.CompiledScript;
import javax.script.ScriptException;
import java.io.File;
import java.util.Objects;

@SuppressWarnings("all")
public class TestAllowAndDisallowClasses {

  @Test
  public void test_file() throws ScriptCPUAbuseException, ScriptException {
    final NashornSandbox sandbox = NashornSandboxes.create();
    final String testClassScript = "var File = Java.type('java.io.File'); File;";
    sandbox.allow(File.class);
    sandbox.eval(testClassScript);
    if (!sandbox.isAllowed(File.class)) {
      Assert.fail("Expected class File is allowed.");
    }
    sandbox.disallow(File.class);
    try {
      sandbox.eval(testClassScript);
      Assert.fail("When disallow the File class expected a ClassNotFoundException!");
    } 
    catch (final RuntimeException e) {
      if (((!(e.getCause() instanceof ClassNotFoundException)) || (!Objects.equals(e.getCause().getMessage(), "java.io.File")))) {
        throw e;
      }
    }
    sandbox.allow(File.class);
    sandbox.eval(testClassScript);
    sandbox.disallowAllClasses();
    try {
      sandbox.eval(testClassScript);
      Assert.fail("When disallow all classes expected a ClassNotFoundException!");
    } catch (final RuntimeException e) {
      if (((!(e.getCause() instanceof ClassNotFoundException)) || (!Objects.equals(e.getCause().getMessage(), "java.io.File")))) {
        throw e;
      }
    }
  }

  @Test
  public void test_file_compiled() throws ScriptException {
    final NashornSandbox sandbox = NashornSandboxes.create();
    final String testClassScript = "var File = Java.type(\"java.io.File\"); File;";
    sandbox.allow(File.class);
    sandbox.compile(testClassScript).eval();
    boolean _isAllowed = sandbox.isAllowed(File.class);
    boolean _not = (!_isAllowed);
    if (_not) {
      Assert.fail("Expected class File is allowed.");
    }
    sandbox.disallow(File.class);
    try {
      sandbox.compile(testClassScript).eval();
      Assert.fail("When disallow the File class expected a ClassNotFoundException!");
    } catch (final RuntimeException e) {
      if (((!(e.getCause() instanceof ClassNotFoundException)) || (!Objects.equals(e.getCause().getMessage(), "java.io.File")))) {
        throw e;
      }
    }
    sandbox.allow(File.class);
    sandbox.compile(testClassScript).eval();
    sandbox.disallowAllClasses();
    sandbox.allow(InterruptTest.class);
    try {
      CompiledScript compiled = sandbox.compile(testClassScript);
      sandbox.eval(compiled);
      Assert.fail("When disallow all classes expected a ClassNotFoundException!");
    } catch (final RuntimeException e) {
      if (((!(e.getCause() instanceof ClassNotFoundException)) || (!Objects.equals(e.getCause().getMessage(), "java.io.File")))) {
        throw e;
      }
    }
  }
}
