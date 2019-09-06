#!/usr/bin/env kscript
@file:Include("base.kts")

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

fun replaceMethodOnSameClass(qualifiedName: String, replacement: String): (CompilationUnit, File) -> Unit {
    return { cu, file ->
        run {
            var changed = false
            cu.findAll(MethodCallExpr::class.java)
                    .filter { mce -> mce.getQualifiedSignature() == "com.google.common.base.Converter.apply(A)" }
                    .forEach { mce ->
                        run {
                            mce.setName("convert")
                            changed = true;
                        }
                    }
            if (changed) {
                file.writeText(cu.toString(PrettyPrinterConfiguration()))
            }
        }
    }
