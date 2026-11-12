// ============================================================
//  MENU INIZIALE (MainMenu)
//  Il menu: Gioca apre un livello, Esci chiude il gioco.
//
//  DOVE SI METTE
//    Nella scena Menu (usa quella del kit come esempio).
//
//  COSA CONFIGURARE (nell'Inspector)
//    Scene To Load: il nome esatto della scena da aprire con Gioca (es. Sample_Completo). La scena va anche in File > Build Profiles > Scene List.
//    First Selected: il bottone selezionato all'inizio, per il gamepad.
//
//  COME SI COLLEGA
//    Nei bottoni: On Click > + > questo oggetto > MainMenu > Play (o Quit).
//
//  ESEMPIO
//    Scene To Load = "Livello_Tempio".
// ============================================================
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

/// <summary>Menu iniziale: Gioca apre la scena indicata, Esci chiude il gioco.</summary>
public class MainMenu : MonoBehaviour
{
    [Tooltip("Nome della scena da aprire con Gioca (es. Sample_Completo)")] public string sceneToLoad = "Sample_Completo";
    [Tooltip("Bottone selezionato all'inizio, per usare il menu con il gamepad")] public Button firstSelected;

    void Start()
    {
        Time.timeScale = 1f; Cursor.lockState = CursorLockMode.None; Cursor.visible = true;
        if (firstSelected && EventSystem.current) EventSystem.current.SetSelectedGameObject(firstSelected.gameObject);
    }

    /// <summary>Apre la scena. Nell'editor funziona anche se la scena non e' nelle Build Settings.</summary>
    public void Play()
    {
        if (Application.CanStreamedLevelBeLoaded(sceneToLoad)) { SceneManager.LoadScene(sceneToLoad); return; }
#if UNITY_EDITOR
        foreach (var guid in UnityEditor.AssetDatabase.FindAssets(sceneToLoad + " t:Scene"))
        {
            var path = UnityEditor.AssetDatabase.GUIDToAssetPath(guid);
            if (System.IO.Path.GetFileNameWithoutExtension(path) != sceneToLoad) continue;
            UnityEditor.SceneManagement.EditorSceneManager.LoadSceneInPlayMode(path, new LoadSceneParameters(LoadSceneMode.Single));
            return;
        }
#endif
        Debug.LogWarning($"Scena '{sceneToLoad}' non trovata: aggiungila in File > Build Profiles > Scene List.", this);
    }

    /// <summary>Esce dal gioco (nell'editor ferma il Play).</summary>
    public void Quit()
    {
#if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
#else
        Application.Quit();
#endif
    }
}
