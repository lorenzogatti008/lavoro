// ============================================================
//  LUCE SOLO IN QUALITA' ALTA (HighQualityOnly)
//  Spegne una luce decorativa quando la qualita' e' Bassa.
//
//  DOVE SI METTE
//    Su una luce di una torcia o di un braciere (serve una Light).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Niente da configurare.
//
//  COME SI COLLEGA
//    Lo comanda il QualityManager.
//
//  ESEMPIO
//    Su la luce del braciere, per alleggerire il gioco.
// ============================================================
using UnityEngine;

/// <summary>Su una luce decorativa (torcia, braciere): la luce resta accesa solo con qualita' Alta.</summary>
[RequireComponent(typeof(Light))]
public class HighQualityOnly : MonoBehaviour
{
    void OnEnable()
    {
        // Senza QualityManager in scena la luce resta accesa.
        var q = QualityManager.Instance;
        Apply(!q || q.Current == QualityManager.Level.Alta);
    }

    /// <summary>Accende o spegne la luce (la chiama il QualityManager).</summary>
    public void Apply(bool highQuality) { GetComponent<Light>().enabled = highQuality; }
}
