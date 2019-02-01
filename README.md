# identity-management-samples

## MIM Privileged Access Management sample web application

The Microsoft Identity Manager (MIM) product as configured for Privileged Access Management (PAM) includes a REST API, for developers integrating MIM for PAM scenario with custom clients for elevation, without needing to use PowerShell or SOAP to communicate with MIM.

The sub-folder `Privileged-Access-Management-Portal/src` contains a sample web application which demonstrates the use of this [MIM PAM REST API](https://docs.microsoft.com/en-us/microsoft-identity-manager/reference/privileged-access-management-rest-api-reference).

For installation instructions for the REST API and this sample, see the section "Set up the sample web application" in 
[Step 4 – Install MIM components on PAM server and workstation](https://docs.microsoft.com/en-us/microsoft-identity-manager/pam/step-4-install-mim-components-on-pam-server).

## Change history

### February 1, 2019

Security improvement in how the PAM sample incorporates data returned by the MIM PAM REST API into HTML using jQuery.  Acknowledgement to issue found by [T. Sluijter](https://www.kilala.nl).
