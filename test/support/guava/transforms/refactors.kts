#!/usr/bin/env kscript
import com.github.javaparser.ast.CompilationUnit
import com.github.javaparser.ast.expr.MethodCallExpr
import com.github.javaparser.printer.PrettyPrinterConfiguration
import java.io.File

fun MethodCallExpr.getQualifiedSignature(): String? {
    try {
        val resolved = this.resolve();
        return resolved.qualifiedSignature;
    } catch(e: Exception) {
        return null;
    }
}

fun replaceStaticMethodWithSameArguments(qualifiedName: String, replacementClassFQN: String, replacementMethod: String): (CompilationUnit, File) -> Unit {
    return { cu, file ->
        run {
            var changed = false
            cu.findAll(MethodCallExpr::class.java)
                    .filter { mce -> mce.getQualifiedSignature() == qualifiedName }
                    .forEach { mce ->
                        run {
                            mce.setName(replacementMethod)
                            mce.setScope(NameExpr(replacementClassFQN))
                            changed = true;
                        }
                    }
            if (changed) {
                file.writeText(cu.toString(PrettyPrinterConfiguration()))
            }
        }
    }
}

fun replaceMethodOnSameClass(qualifiedName: String, replacement: String): (CompilationUnit, File) -> Unit {
    return { cu, file ->
        run {
            var changed = false
            cu.findAll(MethodCallExpr::class.java)
                    .filter { mce -> mce.getQualifiedSignature() == qualifiedName }
                    .forEach { mce ->
                        run {
                            mce.setName(replacement)
                            changed = true;
                        }
                    }
            if (changed) {
                file.writeText(cu.toString(PrettyPrinterConfiguration()))
            }
        }
    }
}
