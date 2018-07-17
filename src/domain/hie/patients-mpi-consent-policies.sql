SELECT * FROM HS_Consent_Policy.MPIPatient

--- *
SELECT ID, MPI, EffectiveDate, ExpirationDate, InActive
FROM HS_Consent_Policy.Patient
WHERE effectiveDate <= TO_DATE('2018-04-30', 'YYYY-MM-DD')
AND expirationDate >= TO_DATE('2017-04-01', 'YYYY-MM-DD')
ORDER BY MPI

---
if ((tExpDate!="")&&(tExpDate < $H))||((tEffDate!="")&&(tEffDate > $H))||(tInactive) {
    if ('tInactiveCounted) { set tInactiveCount=tInactiveCount+1, tInactiveCounted=1 }
}
else { 
    if ('tActiveCounted) { set tActiveCount=tActiveCount+1, tActiveCounted=1 }
}

----
SELECT * FROM (
  (SELECT 1 as ID, 100000003 as MPI, TO_DATE('2017-02-15', 'YYYY-MM-DD') as EffectiveDate, TO_DATE('2017-03-01', 'YYYY-MM-DD') as ExpirationDate, '' as InActive)
UNION
  (SELECT 2 as ID, 100000003 as MPI, TO_DATE('2017-03-15', 'YYYY-MM-DD') as EffectiveDate, TO_DATE('2017-04-01', 'YYYY-MM-DD') as ExpirationDate, '' as InActive)
UNION
  (SELECT 3 as ID, 100000003 as MPI, TO_DATE('2017-02-15', 'YYYY-MM-DD') as EffectiveDate, TO_DATE('2017-03-01', 'YYYY-MM-DD') as ExpirationDate, 'Y' as InActive)
UNION  
  (SELECT 4 as ID, 100000004 as MPI, TO_DATE('2017-02-15', 'YYYY-MM-DD') as EffectiveDate, TO_DATE('2017-03-01', 'YYYY-MM-DD') as ExpirationDate, '' as InActive)
)

----
DELETE FROM HS_Consent_Policy.Patient

INSERT INTO HS_Consent_Policy.Patient (MPI, EffectiveDate, ExpirationDate, InActive) 
    VALUES (100000003, TO_DATE('2017-02-15', 'YYYY-MM-DD'), TO_DATE('2017-03-01', 'YYYY-MM-DD'), '')

INSERT INTO HS_Consent_Policy.Patient (MPI, EffectiveDate, ExpirationDate, InActive) 
    VALUES (100000003, TO_DATE('2017-03-15', 'YYYY-MM-DD'), TO_DATE('2017-04-01', 'YYYY-MM-DD'), '')

INSERT INTO HS_Consent_Policy.Patient (MPI, EffectiveDate, ExpirationDate, InActive) 
    VALUES (100000003, TO_DATE('2017-04-15', 'YYYY-MM-DD'), TO_DATE('2017-05-01', 'YYYY-MM-DD'), 'Y')

INSERT INTO HS_Consent_Policy.Patient (MPI, EffectiveDate, ExpirationDate, InActive) 
    VALUES (100000004, TO_DATE('2017-02-15', 'YYYY-MM-DD'), TO_DATE('2017-03-01', 'YYYY-MM-DD'), '')

INSERT INTO HS_Consent_Policy.Patient (MPI, EffectiveDate, ExpirationDate, InActive) 
    VALUES (100000005, TO_DATE('2018-04-01', 'YYYY-MM-DD'), '', '')    