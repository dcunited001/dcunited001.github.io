
### patching openssl 1.0.2d for tianocore

```shell
git clone git@github.com:openssl/openssl
cd openssl
git checkout OpenSSL_1_0_2d
```

realized that this is a vulnerable version of openssl, so i should probably figure out how to install a newer version of rEFInd or something.  on second though, tianocore/UDK2014 shouldn't really use openssl for any networking... i don't think

security questions:
- strange that building EDK2014 requires patched version of OpenSSL.  really, it's not that strange looking at the patch.  buuut, still.  wierd.
- even stranger that the openssl version hasn't been patched.
- can a buffer overflow inside an openssql function call direct control to other code, then return control to the calling program, negating the openssl check?  (returning verified, when it was not?)
- can a patched version of openssl be used in an attack with iPXE?

anyways .. just going to apply the patch and move on:

```shell
# cp OpenSSL checkout to $WKSP/

cd $WKSP
cd Crypto/.../openssl
patch -fdsa ../EFI.patch

# ran into error where patch couldn't locate this file
# needed to manually apply part of the patch to correct the filename openssl.conf.h.in
# then i needed to update install.sh and manually correct the reference to openssl.conf.h.in

# then ran install.sh and it copied the files to $WKSP/Crypto/include
```
