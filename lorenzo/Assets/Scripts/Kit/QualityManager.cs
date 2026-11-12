// ============================================================
//  QUALITA' GRAFICA (QualityManager)
//  Qualita' Bassa (predefinita) o Alta, a scelta dal menu pausa.
//
//  DOVE SI METTE
//    E' gia' dentro PF_Kit_GameManager. Non va toccato.
//
//  COSA CONFIGURARE (nell'Inspector)
//    Low Quality e High Quality: i due asset URP del kit (Kit_Bassa_RPAsset e Kit_Alta_RPAsset), gia' collegati.
//
//  COME SI COLLEGA
//    Il bottone Qualita' nel menu pausa lo usa da solo.
//
//  ESEMPIO
//    Se il gioco va a scatti: pausa > Qualita' > Bassa.
// ============================================================
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

/// <summary>
/// Qualita' grafica Bassa (predefinita) o Alta: applica l'asset URP del kit con QualitySettings.renderPipeline,
/// quindi funziona in qualunque progetto. Bassa: niente post-processing, luci decorative spente.
/// Sta nel prefab PF_Kit_GameManager.
/// </summary>
public class QualityManager : MonoBehaviour
{
    public enum Level { Bassa, Alta }

    /// <summary>Chiave in PlayerPrefs dove si salva la scelta.</summary>
    public const string PrefsKey = "Heritage.Qualita";

    public static QualityManager Instance { get; private set; }

    [Tooltip("Asset URP della qualita' Bassa (Kit_Bassa_RPAsset)")] public RenderPipelineAsset lowQuality;
    [Tooltip("Asset URP della qualita' Alta (Kit_Alta_RPAsset)")] public RenderPipelineAsset highQuality;

    Level current = Level.Bassa; RenderPipelineAsset previous; bool applied;
    public Level Current => current;

    void Awake()
    {
        if (Instance && Instance != this) Debug.LogWarning("Ci sono due QualityManager nella scena: ne serve uno solo.", this);
        Instance = this;
        previous = QualitySettings.renderPipeline;
        current = PlayerPrefs.GetString(PrefsKey, nameof(Level.Bassa)) == nameof(Level.Alta) ? Level.Alta : Level.Bassa;
    }

    void Start() { Apply(); }

    void OnDestroy()
    {
        // Nell'editor il cambio resterebbe nelle impostazioni del progetto: rimetto l'asset di prima.
        if (applied) QualitySettings.renderPipeline = previous;
        if (Instance == this) Instance = null;
    }

    public void Set(Level level)
    {
        current = level;
        PlayerPrefs.SetString(PrefsKey, level.ToString());
        Apply();
    }

    public void Toggle() => Set(current == Level.Bassa ? Level.Alta : Level.Bassa);

    void Apply()
    {
        var asset = current == Level.Alta ? highQuality : lowQuality;
        if (asset) { QualitySettings.renderPipeline = asset; applied = true; }
        bool high = current == Level.Alta;
        foreach (var cam in FindObjectsByType<UniversalAdditionalCameraData>()) cam.renderPostProcessing = high;
        foreach (var l in FindObjectsByType<HighQualityOnly>(FindObjectsInactive.Include)) l.Apply(high);
    }
}
